package cache

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"slices"
	"time"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"

	"github.com/redis/go-redis/v9"
)

// Maintain a limit on how many chats to store in the context cache
const maxChatRecords = 5

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
// - initialExpiry: Initial expiry duration for the guest session
//
// Returns:
// - The unique guest session ID
// - Any error that occurred
func NewGuestSession(rdb *redis.Client, initialExpiry time.Duration) (string, error) {
	ctx := context.Background()

	for {
		bytes := make([]byte, 8)

		if _, err := rand.Read(bytes); err != nil {
			return "", err
		}

		id := hex.EncodeToString(bytes)
		key := FmtGuestSessionKey(id)

		// Check if session exists
		exists, err := rdb.Exists(ctx, key).Result()

		if err != nil {
			return "", err
		}

		// Try again if session already exists
		if exists > 0 {
			continue
		}

		// Initialize the list with a placeholder
		pipe := rdb.TxPipeline()
		pipe.LPush(ctx, key, "[]")           // Ensures list exists
		pipe.Expire(ctx, key, initialExpiry) // Set expiration

		if _, err := pipe.Exec(ctx); err != nil {
			return "", err
		}

		return id, nil
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
	incrCmd := pipe.Incr(ctx, utils.GlobalChatIdCounterKey)

	// Fetch last maxChatRecords messages
	lrangeCmd := pipe.LRange(ctx, key, 0, -1)

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
	data, err := lrangeCmd.Result()

	if err != nil {
		return -1, nil, err
	}

	chatRecords := make([]models.ChatRecord, 0, len(data))

	for _, jsonRecord := range data {
		var record models.ChatRecord

		if err := json.Unmarshal([]byte(jsonRecord), &record); err == nil {
			chatRecords = append(chatRecords, record)
		}
	}

	// Reverse chat history to maintain order (oldest first)
	slices.Reverse(chatRecords)
	return chatId, chatRecords, nil
}

// Save a chat record for a guest/user
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

	// Push new chat record to the list (newest first)
	pipe.LPush(ctx, key, recordJson)

	// Trim the list to maintain only the latest records
	pipe.LTrim(ctx, key, 0, maxChatRecords-1)

	// Refresh expiry for session
	pipe.Expire(ctx, key, utils.GuestSessionExpiry)

	// Execute pipeline
	_, err = pipe.Exec(ctx)
	return err
}
