package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"

	"github.com/redis/go-redis/v9"
)

// Get the next chat ID and all previous chat records for a guest/user
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
//
// Returns:
// - The next chat ID
// - The system prompt
// - All previous chat records
// - Any error that occurred
func GetChatContext(rdb *redis.Client, key string) (int64, string, []models.ChatRecord, error) {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Check if session exists
	existsCmd := pipe.Exists(ctx, key)

	// Get the next chat ID
	incrCmd := pipe.Incr(ctx, globalChatIdCounterKey)

	// Get the system prompt
	getCmd := pipe.Get(ctx, globalSystemPromptKey)

	// Fetch all messages from highest chat ID to lowest
	// Keep the number of messages to a maximum
	zrevrangeCmd := pipe.ZRevRange(ctx, key, 0, utils.MaxChatsInAContext-1)

	if _, err := pipe.Exec(ctx); err != nil {
		return -1, "", nil, err
	}

	// Ensure session exists
	if exists, err := existsCmd.Result(); err != nil || exists == 0 {
		return -1, "", nil, ErrSessionNotFound
	}

	// Get the next chat ID
	chatId, err := incrCmd.Result()

	if err != nil {
		return -1, "", nil, err
	}

	// Get the system prompt
	systemPrompt, err := getCmd.Result()

	if err != nil {
		return -1, "", nil, err
	}

	// Deserialize chat records
	serializedRecords, err := zrevrangeCmd.Result()

	if err != nil {
		return -1, "", nil, err
	}

	chatRecords := make([]models.ChatRecord, 0, len(serializedRecords))

	for _, jsonRecord := range serializedRecords {
		var record models.ChatRecord

		if err := json.Unmarshal([]byte(jsonRecord), &record); err == nil {
			chatRecords = append(chatRecords, record)
		}
	}

	return chatId, systemPrompt, chatRecords, nil
}

// Save a chat record for a guest/user
// Will remove oldest records if the maximum is exceeded
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
// - record: The chat record to save
//
// Returns:
// - Any error that occurred
func SaveChatRecord(rdb *redis.Client, key string, record models.ChatRecord) error {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Serialize the chat record to JSON
	recordJson, err := json.Marshal(record)

	if err != nil {
		return err
	}

	recordScore := float64(record.ChatId)

	// Add the chat record to the sorted set
	pipe.ZAdd(ctx, key, redis.Z{Score: recordScore, Member: recordJson})

	// Trim the sorted set to the maximum number of records
	pipe.ZRemRangeByRank(ctx, key, 0, -utils.MaxChatsPerConversation-1)

	// Refresh the session expiry
	pipe.Expire(ctx, key, cacheSessionExpiry)

	// Execute pipeline
	_, err = pipe.Exec(ctx)
	return err
}

// Delete a chat record for a guest/user
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
// - chatId: The chat ID to delete
//
// Returns:
// - Any error that occurred
func DeleteChatRecord(rdb *redis.Client, key string, chatId int64) error {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Remove the chat record from the sorted set by chat ID
	score := fmt.Sprint(chatId)
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
