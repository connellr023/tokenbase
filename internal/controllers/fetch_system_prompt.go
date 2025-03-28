package controllers

import (
	"tokenbase/internal/cache"
	"tokenbase/internal/db"

	"github.com/redis/go-redis/v9"
	"github.com/surrealdb/surrealdb.go"
)

// Retrieve the system prompt from the cache if available, otherwise fetch from the database and then caches it
//
// Parameters:
// - sdb: a surrealdb database instance
// - rdb: a redis client instance
//
// Returns:
// - The system prompt
// - An error if the system prompt could not be retrieved or cached
func fetchSystemPrompt(sdb *surrealdb.DB, rdb *redis.Client) (string, error) {
	// Check cache for system prompt
	systemPrompt, err := cache.GetSystemPrompt(rdb)

	if err != nil {
		// Try to get the system prompt from the database
		if systemPrompt, err = db.GetSystemPrompt(sdb); err != nil {
			return "", err
		}

		// Cache the system prompt
		if err := cache.SetSystemPrompt(rdb, systemPrompt); err != nil {
			return "", err
		}
	}

	return systemPrompt, nil
}
