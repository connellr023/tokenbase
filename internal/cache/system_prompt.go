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

// Gets the global system prompt
//
// Parameters:
// - rdb: Redis client
//
// Returns:
// - The system prompt
// - Any error that occurred
func GetSystemPrompt(rdb *redis.Client) (string, error) {
	ctx := context.Background()
	return rdb.Get(ctx, globalSystemPromptKey).Result()
}
