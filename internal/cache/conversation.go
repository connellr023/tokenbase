package cache

import (
	"context"

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

// Cache a conversation in Redis
//
// Parameters:
// - rdb: Redis client
// - conversationId: The unique conversation ID
//
// Returns:
// - Any error that occurred
func NewConversation(rdb *redis.Client, key string) error {
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
