package utils

const BackendEndpoint = ":8090"

// Ollama connection details
const (
	TinyLlamaDockerChatEndpoint = "http://tinyllama:11434/api/chat"
	TinyLlamaModelName          = "tinyllama"
	TinyLlamaKeepAliveSecs      = 60
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
