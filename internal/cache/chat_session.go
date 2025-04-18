package cache

import (
	"context"
	"strconv"
	"time"
	"tokenbase/internal/utils"

	"github.com/redis/go-redis/v9"
)

// Format a conversation key for Redis.
//
// Parameters:
// - userID: The unique user ID.
// - conversationID: The unique conversation ID.
//
// Returns:
// - The formatted conversation key.
func FmtConversationKey(userID string, conversationID string) string {
	return "conversation:(" + userID + "," + conversationID + ")"
}

// Format a guest session key for Redis.
//
// Parameters:
// - sessionID: The unique guest session ID.
//
// Returns:
// - The formatted guest session key.
func FmtGuestSessionKey(sessionID string) string {
	return "guest_session:" + sessionID
}

// Generate a unique guest session ID.
//
// Returns:
// - The generated guest session ID.
func GenerateGuestSessionID() string {
	id := strconv.FormatInt(time.Now().UnixNano(), 16)
	return id
}

// Cache a conversation in Redis.
//
// Parameters:
// - ctx: The context for the operation.
// - rdb: Redis client.
// - key: The key for the conversation.
//
// Returns:
// - Any error that occurred.
func NewChatSession(ctx context.Context, rdb *redis.Client, key string) error {
	// Start a transaction.
	pipe := rdb.TxPipeline()
	zaddnxCmd := pipe.ZAddNX(ctx, key, redis.Z{Score: -1, Member: dummySortedSetMember})
	pipe.Expire(ctx, key, cacheSessionExpiry)

	// Execute pipeline.
	if _, err := pipe.Exec(ctx); err != nil {
		return err
	}

	// Check if the conversation was created.
	if created, err := zaddnxCmd.Result(); err != nil {
		return err
	} else if created == 0 {
		return utils.ErrConversationExists
	}

	return nil
}

// Delete a chat session in Redis.
//
// Parameters:
// - ctx: The context for the operation.
// - rdb: Redis client.
// - key: The key for the chat session.
//
// Returns:
// - Any error that occurred.
func DeleteChatSession(ctx context.Context, rdb *redis.Client, key string) error {
	_, err := rdb.Del(ctx, key).Result()
	return err
}
