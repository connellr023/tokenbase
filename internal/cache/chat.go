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

	// Loop until a unique guest session ID is generated
	for {
		bytes := make([]byte, 8)

		{
			_, err := rand.Read(bytes)

			if err != nil {
				return "", err
			}
		}

		id := hex.EncodeToString(bytes)
		key := FmtGuestSessionKey(id)

		// Check if the key already exists
		set, err := rdb.HSetNX(ctx, key, "initialized", true).Result()

		if err != nil {
			return "", err
		}

		// Try again if the key already exists
		if !set {
			continue
		}

		// Set the expiry for the guest session
		if err := rdb.Expire(ctx, key, initialExpiry).Err(); err != nil {
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
	existsCmd := pipe.Exists(ctx, key)
	incrCmd := pipe.Incr(ctx, utils.GlobalChatIdCounterKey)
	hgetallCmd := pipe.HGetAll(ctx, key)

	if _, err := pipe.Exec(ctx); err != nil {
		return -1, nil, err
	}

	// Ensure the key exists
	if exists, err := existsCmd.Result(); err != nil || exists == 0 {
		return -1, nil, ErrSessionNotFound
	}

	// Get the chat ID of the new chat
	chatId, err := incrCmd.Result()

	if err != nil {
		return -1, nil, err
	}

	// Get all previous chat records
	data, err := hgetallCmd.Result()

	if err != nil {
		return -1, nil, err
	}

	chatRecords := make([]models.ChatRecord, 0, len(data))

	for _, v := range data {
		var record models.ChatRecord

		if err := json.Unmarshal([]byte(v), &record); err != nil {
			continue
		}

		chatRecords = append(chatRecords, record)
	}

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
	expireCmd := pipe.Expire(ctx, key, utils.GuestSessionExpiry) // Refresh the expiry

	// Serialize the chat record to JSON
	recordJson, err := json.Marshal(record)

	if err != nil {
		return err
	}

	hsetCmd := pipe.HSet(ctx, key, record.ChatId, recordJson)

	// Execute the pipeline
	if _, err := pipe.Exec(ctx); err != nil {
		return err
	}

	// Ensure expiration was set
	if expireSuccess, err := expireCmd.Result(); err != nil || !expireSuccess {
		return ErrFailedToRefreshExpiry
	}

	// Ensure the chat record was saved
	if hsetCmd.Err() != nil {
		return hsetCmd.Err()
	}

	return nil
}
