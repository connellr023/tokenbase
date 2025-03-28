package cache

import (
	"context"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

// Format a conversation key for Redis
//
// Parameters:
// - conversationId: The unique conversation ID
//
// Returns:
// - The formatted conversation key
func FmtConversationKey(conversationId string) string {
	return "conversation:" + conversationId
}

// Format a guest session key for Redis
//
// Parameters:
// - sessionId: The unique guest session ID
//
// Returns:
// - The formatted guest session key
func FmtGuestSessionKey(sessionId string) string {
	return "guest_session:" + sessionId
}

// Generate a unique guest session ID
//
// Returns:
// - The generated guest session ID
func GenerateGuestSessionID() string {
	id := strconv.FormatInt(time.Now().UnixNano(), 16)
	return id
}

// Cache a conversation in Redis
//
// Parameters:
// - rdb: Redis client
// - conversationId: The unique conversation ID
//
// Returns:
// - Any error that occurred
func NewChatSession(rdb *redis.Client, key string) error {
	ctx := context.Background()

	// Start a transaction
	pipe := rdb.TxPipeline()
	zaddnxCmd := pipe.ZAddNX(ctx, key, redis.Z{Score: -1, Member: dummySortedSetMember})
	pipe.Expire(ctx, key, cacheSessionExpiry)

	// Execute pipeline
	if _, err := pipe.Exec(ctx); err != nil {
		return err
	}

	// Check if the conversation was created
	if created, err := zaddnxCmd.Result(); err != nil {
		return err
	} else if created == 0 {
		return ErrConversationExists
	}

	return nil
}
