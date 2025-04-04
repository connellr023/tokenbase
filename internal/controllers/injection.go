package controllers

import (
	"github.com/redis/go-redis/v9"
	"github.com/surrealdb/surrealdb.go"
)

// Used for dependency injection in the controllers.
type Injection struct {
	Sdb *surrealdb.DB
	Rdb *redis.Client
}
