package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"

	"github.com/redis/go-redis/v9"
)

// Get the all previous chat records for a guest/user
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
//
// Returns:
// - All previous chat records
// - Any error that occurred
func GetChatContext(rdb *redis.Client, key string) ([]models.ClientChatRecord, error) {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Check if session exists
	existsCmd := pipe.Exists(ctx, key)

	// Fetch all messages from most recent creation time to oldest
	// Keep the number of messages to a maximum
	zrevrangeCmd := pipe.ZRevRange(ctx, key, 0, utils.MaxChatsInAContext-1)

	if _, err := pipe.Exec(ctx); err != nil {
		return nil, err
	}

	// Ensure session exists
	if exists, err := existsCmd.Result(); err != nil || exists == 0 {
		return nil, ErrSessionNotFound
	}

	// Deserialize chat records
	serializedRecords, err := zrevrangeCmd.Result()

	if err != nil {
		return nil, err
	}

	chatRecords := make([]models.ClientChatRecord, 0, len(serializedRecords))

	for _, jsonRecord := range serializedRecords {
		var record models.ClientChatRecord

		if err := json.Unmarshal([]byte(jsonRecord), &record); err == nil {
			chatRecords = append(chatRecords, record)
		}
	}

	return chatRecords, nil
}

// Save chat records for a guest/user
// Will remove oldest records if the maximum is exceeded
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
// - record: The chat record to save
//
// Returns:
// - Any error that occurred
func SaveChatRecords(rdb *redis.Client, key string, records ...models.ClientChatRecord) error {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Map chat records to sorted set members
	zRecords := make([]redis.Z, 0, len(records))

	for _, record := range records {
		recordJson, err := json.Marshal(record)

		if err != nil {
			return err
		}

		zRecords = append(zRecords, redis.Z{
			Score:  float64(record.CreatedAt),
			Member: recordJson,
		})
	}

	// Add the chat record to the sorted set
	pipe.ZAdd(ctx, key, zRecords...)

	// Refresh the session expiry
	pipe.Expire(ctx, key, cacheSessionExpiry)

	// Execute pipeline
	_, err := pipe.Exec(ctx)
	return err
}

// Delete a chat record for a guest/user
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
// - createdAt: The creation time of the chat record to delete
//
// Returns:
// - Any error that occurred
func DeleteChatRecord(rdb *redis.Client, key string, createdAt int64) error {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Remove the chat record from the sorted set by creation time
	score := fmt.Sprint(createdAt)
	zremrangebyrankCmd := pipe.ZRemRangeByScore(ctx, key, score, score)

	// Execute pipeline
	if _, err := pipe.Exec(ctx); err != nil {
		return err
	}

	// Ensure a chat record was deleted
	if count, err := zremrangebyrankCmd.Result(); err != nil || count == 0 {
		return ErrChatRecordNotFound
	}

	return nil
}
