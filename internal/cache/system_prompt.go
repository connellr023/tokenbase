package cache

import (
	"context"

	"github.com/redis/go-redis/v9"
)

// Sets the global system prompt
// This is for admin use only
//
// Parameters:
// - rdb: Redis client
// - systemPrompt: The new system prompt
//
// Returns:
// - Any error that occurred
func SetSystemPrompt(rdb *redis.Client, systemPrompt string) error {
	ctx := context.Background()
	return rdb.Set(ctx, globalSystemPromptKey, systemPrompt, 0).Err()
}
