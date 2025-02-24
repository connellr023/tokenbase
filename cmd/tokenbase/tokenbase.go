package main

import (
	"fmt"

	"github.com/surrealdb/surrealdb.go"
)

const sdbDockerEndpoint = "ws://surrealdb:8000"
const rdbDockerEndpoint = "redis:6379"
const backendEndpoint = ":8090"

const sdbNamespace = "tokenbaseNS"
const sdbName = "tokenbaseDB"

// Hardcode these for now
const sdbUsername = "root"
const sdbPassword = "root"

func main() {
	// Connect to SurrealDB over the Docker network
	fmt.Printf("Connecting to SurrealDB at %s...\n", sdbDockerEndpoint)

	sdb, err := surrealdb.New(sdbDockerEndpoint)

	if err != nil {
		panic(err)
	}

	// Set the namespace
	if err := sdb.Use(sdbNamespace, sdbName); err != nil {
		panic(err)
	}

	// Authenticate
	token, err := sdb.SignIn(&surrealdb.Auth{
		Username: sdbUsername,
		Password: sdbPassword,
	})

	if err != nil {
		panic(err)
	}

	// Check token validity
	if err := sdb.Authenticate(token); err != nil {
		panic(err)
	}

	// Invalidate the token later
	defer func(token string) {
		if err := sdb.Invalidate(); err != nil {
			panic(err)
		}
	}(token)

	// Connect to Redis over the Docker network
	fmt.Printf("Connecting to Redis at %s...\n", rdbDockerEndpoint)

	// TODO ...

	// Start the backend server
	fmt.Printf("Starting backend server at %s...\n", backendEndpoint)

	// TODO...
}
