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
// - ctx: Context for the operation
//
// Returns:
// - Any error that occurred
func SetSystemPrompt(rdb *redis.Client, systemPrompt string, ctx context.Context) error {
	return rdb.Set(ctx, globalSystemPromptKey, systemPrompt, 0).Err()
}

// Gets the global system prompt
//
// Parameters:
// - rdb: Redis client
// - ctx: Context for the operation
//
// Returns:
// - The system prompt
// - Any error that occurred
func GetSystemPrompt(rdb *redis.Client, ctx context.Context) (string, error) {
	return rdb.Get(ctx, globalSystemPromptKey).Result()
}
