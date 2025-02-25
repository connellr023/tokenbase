package utils

import "time"

const BackendEndpoint = ":8090"

const GlobalChatIdCounterKey = "global_chat_id_counter"

const GuestSessionExpiry = 20 * time.Minute

// Ollama connection details
const (
	TinyLlamaDockerEndpoint = "http://tinyllama:11434/api/generate"
	TinyLlamaModelName      = "tinyllama"
)

// SurrealDB connection details
const (
	SdbDockerEndpoint = "ws://surrealdb:8000"
	SdbNamespace      = "tokenbaseNS"
	SdbName           = "tokenbaseDB"
	SdbUsername       = "root" // Hardcoded for now
	SdbPassword       = "root" // Hardcoded for now
)

// Redis connection details
const (
	RdbDockerEndpoint = "redis:6379"
	RdbDatabase       = 0
	RdbPassword       = "password" // Hardcoded for now
)
