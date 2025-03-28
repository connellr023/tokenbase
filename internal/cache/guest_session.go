package cache

import (
	"context"
	"crypto/rand"
	"encoding/hex"

	"github.com/redis/go-redis/v9"
)

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

// Create a new guest session with a unique ID
// The session will expire after a certain duration
//
// Parameters:
// - rdb: Redis client
//
// Returns:
// - The unique guest session ID
// - Any error that occurred
func NewGuestSession(rdb *redis.Client) (string, error) {
	ctx := context.Background()

	for {
		bytes := make([]byte, 8)

		if _, err := rand.Read(bytes); err != nil {
			return "", err
		}

		id := hex.EncodeToString(bytes)
		key := FmtGuestSessionKey(id)

		// Check if session exists and create a new sorted set
		pipe := rdb.TxPipeline()
		zaddnxCmd := pipe.ZAddNX(ctx, key, redis.Z{Score: -1, Member: dummySortedSetMember})
		pipe.Expire(ctx, key, cacheSessionExpiry)

		// Execute pipeline
		if _, err := pipe.Exec(ctx); err != nil {
			return "", err
		}

		// Check if the session was created
		if created, err := zaddnxCmd.Result(); err != nil {
			return "", err
		} else if created > 0 {
			return id, nil
		}
	}
}
