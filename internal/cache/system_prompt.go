package cache

import (
	"context"

	"github.com/redis/go-redis/v9"
)

// Sets the global system prompt.
// This is for admin use only.
//
// Parameters:
// - ctx: Context for the operation.
// - rdb: Redis client.
// - systemPrompt: The new system prompt.
//
// Returns:
// - Any error that occurred.
func SetSystemPrompt(ctx context.Context, rdb *redis.Client, systemPrompt string) error {
	return rdb.Set(ctx, globalSystemPromptKey, systemPrompt, 0).Err()
}

// Gets the global system prompt.
//
// Parameters:
// - ctx: Context for the operation.
// - rdb: Redis client.
//
// Returns:
// - The system prompt.
// - Any error that occurred.
func GetSystemPrompt(ctx context.Context, rdb *redis.Client) (string, error) {
	return rdb.Get(ctx, globalSystemPromptKey).Result()
}
