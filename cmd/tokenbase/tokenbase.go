package main

import (
	"context"
	"net/http"
	"tokenbase/internal/constants"
	"tokenbase/internal/controllers"

	"github.com/go-chi/chi/v5"
	"github.com/redis/go-redis/v9"
	"github.com/surrealdb/surrealdb.go"
)

// Authenticate with SurrealDB
//
// Returns:
// - A SurrealDB client
// - A function to invalidate the authentication token
// - An error if authentication fails
func AuthSurrealDb() (*surrealdb.DB, func(), error) {
	sdb, err := surrealdb.New(constants.SdbDockerEndpoint)

	if err != nil {
		return nil, nil, err
	}

	// Set the namespace
	if err := sdb.Use(constants.SdbNamespace, constants.SdbName); err != nil {
		return nil, nil, err
	}

	// Authenticate
	token, err := sdb.SignIn(&surrealdb.Auth{
		Username: constants.SdbUsername,
		Password: constants.SdbPassword,
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
		Addr:     constants.RdbDockerEndpoint,
		Password: constants.RdbPassword,
		DB:       constants.RdbDatabase,
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
	println("Connecting to SurrealDB...")
	sdb, invalidateToken, err := AuthSurrealDb()

	if err != nil {
		panic(err)
	}

	defer invalidateToken()

	// Connect to Redis over the Docker network
	println("Connecting to Redis...")
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
	println("Starting backend server...")
	rootRouter := chi.NewRouter()

	rootRouter.Route("/api", func(r chi.Router) {
		r.Get("/hello", inj.GetHelloWorld)

		// Chat sub-routes
		r.Route("/chat", func(r chi.Router) {
			// Temporary chat sub-routes
			r.Route("/temp", func(r chi.Router) {
				r.Post("/new", inj.PostNewTempChat)
				r.Post("/prompt", inj.PostPromptTempChat)
			})

			// Saved chat sub-routes
			r.Route("/saved", func(r chi.Router) {
				// TODO...
			})
		})
	})

	if err := http.ListenAndServe(constants.BackendEndpoint, rootRouter); err != nil {
		panic(err)
	}

	println("Backend server started on " + constants.BackendEndpoint)
}
