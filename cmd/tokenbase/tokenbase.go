package main

import (
	"context"
	"net/http"
	"time"
	"tokenbase/internal/controllers"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/utils"

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
	sdb, err := surrealdb.New(utils.SdbDockerEndpoint)

	if err != nil {
		return nil, nil, err
	}

	// Set the namespace
	if err := sdb.Use(utils.SdbNamespace, utils.SdbName); err != nil {
		return nil, nil, err
	}

	// Authenticate
	token, err := sdb.SignIn(&surrealdb.Auth{
		Username: utils.SdbUsername,
		Password: utils.SdbPassword,
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
// - An error if authentication fails
func AuthRedis() (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     utils.RdbDockerEndpoint,
		Password: utils.RdbPassword,
		DB:       utils.RdbDatabase,
	})

	ctx := context.Background()
	_, err := rdb.Ping(ctx).Result()

	if err != nil {
		return nil, err
	}

	return rdb, nil
}

func main() {
	// Sleep to wait for Docker containers to start
	time.Sleep(5 * time.Second)

	// Connect to SurrealDB over the Docker network
	println("Connecting to SurrealDB...")
	sdb, invalidateToken, err := AuthSurrealDb()

	if err != nil {
		panic(err)
	}

	defer invalidateToken()

	// Connect to Redis over the Docker network
	println("Connecting to Redis...")
	client, err := AuthRedis()

	if err != nil {
		panic(err)
	}

	// Create the controller injections
	inj := controllers.Injection{
		Sdb: sdb,
		Rdb: client,
	}

	// Start the backend server
	println("Starting backend server...")

	rootRouter := chi.NewRouter()
	middlewares.UseCorsMiddleware(rootRouter)

	rootRouter.Route("/api", func(r chi.Router) {
		middlewares.UseBearerExtractorMiddleware(r)

		r.Post("/login", inj.PostLogin)
		// r.Post("/register", inj.PostRegister)

		r.Get("/suggestions", inj.GetChatSuggestions)
		r.Get("/models", inj.GetModels)

		// Guest sub-routes
		r.Route("/guest", func(r chi.Router) {
			r.Post("/new", inj.PostGuestSession)

			// Guest chat sub-routes
			r.Route("/chat", func(r chi.Router) {
				r.Post("/prompt", inj.PostGuestChat)
				r.Delete("/delete", inj.DeleteGuestChat)
			})
		})

		// User sub-routes
		r.Route("/user", func(r chi.Router) {
			// User chat sub-routes
			r.Route("/chat", func(r chi.Router) {
				// TODO...
			})
		})
	})

	println("Backend server started on " + utils.BackendEndpoint)

	if err := http.ListenAndServe(utils.BackendEndpoint, rootRouter); err != nil {
		panic(err)
	}
}
