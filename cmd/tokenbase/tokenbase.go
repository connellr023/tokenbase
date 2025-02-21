package main

import (
	"fmt"

	"github.com/surrealdb/surrealdb.go"
)

const dbDockerEndpoint = "ws://surrealdb:8000"
const backendEndpoint = ":8090"

const dbNamespace = "tokenbaseNS"
const dbName = "tokenbaseDB"

// Hardcode these for now
const dbUsername = "root"
const dbPassword = "root"

func main() {
	// Connect to the database over the Docker network
	fmt.Printf("Connecting to database at %s...\n", dbDockerEndpoint)

	db, err := surrealdb.New(dbDockerEndpoint)

	if err != nil {
		panic(err)
	}

	// Set the namespace
	if err := db.Use(dbNamespace, dbName); err != nil {
		panic(err)
	}

	// Authenticate
	token, err := db.SignIn(&surrealdb.Auth{
		Username: dbUsername,
		Password: dbPassword,
	})

	if err != nil {
		panic(err)
	}

	// Check token validity
	if err := db.Authenticate(token); err != nil {
		panic(err)
	}

	// Invalidate the token later
	defer func(token string) {
		if err := db.Invalidate(); err != nil {
			panic(err)
		}
	}(token)

	// Start the backend server
	fmt.Printf("Starting backend server at %s...\n", backendEndpoint)

	// TODO...
}
