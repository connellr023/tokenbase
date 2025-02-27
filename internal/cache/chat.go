package cache

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"time"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"

	"github.com/redis/go-redis/v9"
)

const (
	dummySortedSetMember   = "__placeholder__"
	globalChatIdCounterKey = "global_chat_id_counter"
	cacheSessionExpiry     = 20 * time.Minute
)

func FmtGuestSessionKey(sessionId string) string {
	return "guest_session:" + sessionId
}

func FmtUserSessionKey(userId string) string {
	return "user_session:" + userId
}

// Create a new guest session with a unique ID
// The session will expire after a certain duration
//
// Parameters:
// - rdb: Redis client
//
// Returns:
// - The unique guest session ID
// - Any error that occurred
func NewGuestSession(rdb *redis.Client) (string, error) {
	ctx := context.Background()

	for {
		bytes := make([]byte, 8)

		if _, err := rand.Read(bytes); err != nil {
			return "", err
		}

		id := hex.EncodeToString(bytes)
		key := FmtGuestSessionKey(id)

		// Check if session exists and create a new sorted set
		pipe := rdb.TxPipeline()
		zaddnxCmd := pipe.ZAddNX(ctx, key, redis.Z{Score: -1, Member: dummySortedSetMember})
		pipe.Expire(ctx, key, cacheSessionExpiry)

		// Execute pipeline
		if _, err := pipe.Exec(ctx); err != nil {
			return "", err
		}

		// Check if the session was created
		if created, err := zaddnxCmd.Result(); err != nil {
			return "", err
		} else if created > 0 {
			return id, nil
		}
	}
}

// Get the next chat ID and all previous chat records for a guest/user
//
// Parameters:
// - rdb: Redis client
// - key: The key for the guest/user session
//
// Returns:
// - The next chat ID
// - All previous chat records
// - Any error that occurred
func GetChatContext(rdb *redis.Client, key string) (int64, []models.ChatRecord, error) {
	ctx := context.Background()
	pipe := rdb.TxPipeline()

	// Check if session exists
	existsCmd := pipe.Exists(ctx, key)

	// Get the next chat ID
	incrCmd := pipe.Incr(ctx, globalChatIdCounterKey)

	// Fetch all messages from highest chat ID to lowest
	// Keep the number of messages to a maximum
	zrevrangeCmd := pipe.ZRevRange(ctx, key, 0, utils.MaxChatsInAContext-1)

	if _, err := pipe.Exec(ctx); err != nil {
		return -1, nil, err
	}

	// Ensure session exists
	if exists, err := existsCmd.Result(); err != nil || exists == 0 {
		return -1, nil, ErrSessionNotFound
	}

	// Get the next chat ID
	chatId, err := incrCmd.Result()

	if err != nil {
		return -1, nil, err
	}

	// Deserialize chat records
	serializedRecords, err := zrevrangeCmd.Result()

	if err != nil {
		return -1, nil, err
	}

	chatRecords := make([]models.ChatRecord, 0, len(serializedRecords))

	for _, jsonRecord := range serializedRecords {
		var record models.ChatRecord

		if err := json.Unmarshal([]byte(jsonRecord), &record); err == nil {
			chatRecords = append(chatRecords, record)
		}
	}

	return chatId, chatRecords, nil
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
