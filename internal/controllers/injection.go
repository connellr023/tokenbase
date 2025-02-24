package controllers

import (
	"context"

	"github.com/redis/go-redis/v9"
	"github.com/surrealdb/surrealdb.go"
)

// Encapsulates a Redis connection
type RedisConnection struct {
	Client *redis.Client
	Ctx    context.Context
}

// Used for dependency injection in the controllers
type Injection struct {
	Sdb *surrealdb.DB
	Rdb RedisConnection
}
