package utils

import (
	"os"
)

const BackendEndpoint = ":8090"

// Account constraints.
const (
	MinPasswordLength = 8
	MinUsernameLength = 5
	MaxUsernameLength = 25
)

// Ollama connection details.
const (
	OllamaDockerChatEndpoint     = "http://ollama:11434/api/chat"
	OllamaDockerTagsEndpoint     = "http://ollama:11434/api/tags"
	OllamaDockerGenerateEndpoint = "http://ollama:11434/api/generate"
)

// SurrealDB connection details.
var (
	SdbDockerEndpoint = "ws://surrealdb:8000"
	SdbNamespace      = "tokenbaseNS"
	SdbName           = "tokenbaseDB"
)

func GetSdbUsername() string {
	return os.Getenv("SDB_USERNAME")
}

func GetSdbPassword() string {
	return os.Getenv("SDB_PASSWORD")
}

// Redis connection details.
var (
	RdbDockerEndpoint = "redis:6379"
	RdbDatabase       = 0
)

func GetRdbPassword() string {
	return os.Getenv("RDB_PASSWORD")
}
