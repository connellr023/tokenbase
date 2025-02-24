package main

import (
	"context"
	"fmt"
	"net/http"
	"tokenbase/internal/controllers"

	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
	"github.com/surrealdb/surrealdb.go"
)

const backendEndpoint = ":8090"

// SurrealDB connection details
const sdbDockerEndpoint = "ws://surrealdb:8000"
const sdbNamespace = "tokenbaseNS"
const sdbName = "tokenbaseDB"
const sdbUsername = "root" // Hardcoded for now
const sdbPassword = "root" // Hardcoded for now

// Redis connection details
const rdbDockerEndpoint = "redis:6379"
const rdbDatabase = 0
const rdbPassword = "password" // Hardcoded for now

// Authenticate with SurrealDB
//
// Returns:
// - A SurrealDB client
// - A function to invalidate the authentication token
// - An error if authentication fails
func AuthSurrealDb() (*surrealdb.DB, func(), error) {
	sdb, err := surrealdb.New(sdbDockerEndpoint)

	if err != nil {
		return nil, nil, err
	}

	// Set the namespace
	if err := sdb.Use(sdbNamespace, sdbName); err != nil {
		return nil, nil, err
	}

	// Authenticate
	token, err := sdb.SignIn(&surrealdb.Auth{
		Username: sdbUsername,
		Password: sdbPassword,
	})

	if err != nil {
		return nil, nil, err
	}

	// Check token validity
	if err := sdb.Authenticate(token); err != nil {
		return nil, nil, err
	}

	// Allow caller to invalidateToken the token later
	invalidateToken := func() {
		if err := sdb.Invalidate(); err != nil {
			panic(err)
		}
	}

	return sdb, invalidateToken, nil
}

// Authenticate with Redis
//
// Returns:
// - A Redis client
// - A default context to use with Redis commands
// - An error if authentication fails
func AuthRedis() (*redis.Client, context.Context, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     rdbDockerEndpoint,
		Password: rdbPassword,
		DB:       rdbDatabase,
	})

	ctx := context.Background()
	_, err := rdb.Ping(ctx).Result()

	if err != nil {
		return nil, ctx, err
	}

	return rdb, ctx, nil
}

func main() {
	// Connect to SurrealDB over the Docker network
	fmt.Printf("Connecting to SurrealDB at %s...\n", sdbDockerEndpoint)
	sdb, invalidateToken, err := AuthSurrealDb()

	if err != nil {
		panic(err)
	}

	defer invalidateToken()

	// Connect to Redis over the Docker network
	fmt.Printf("Connecting to Redis at %s...\n", rdbDockerEndpoint)
	client, ctx, err := AuthRedis()

	if err != nil {
		panic(err)
	}

	// Create the controller injections
	inj := controllers.Injection{
		Sdb: sdb,
		Rdb: controllers.RedisConnection{
			Client: client,
			Ctx:    ctx,
		},
	}

	// Start the backend server
	fmt.Printf("Starting backend server at %s...\n", backendEndpoint)
	rootRouter := chi.NewRouter()

	rootRouter.Route("/api", func(r chi.Router) {
		r.Get("/hello", inj.GetHelloWorld)
	})

	if err := http.ListenAndServe(backendEndpoint, rootRouter); err != nil {
		panic(err)
	}

	fmt.Printf("Backend server started at %s\n", backendEndpoint)
}
