package utils

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
const (
	SdbDockerEndpoint = "ws://surrealdb:8000"
	SdbNamespace      = "tokenbaseNS"
	SdbName           = "tokenbaseDB"
)

// Redis connection details.
const (
	RdbDockerEndpoint = "redis:6379"
	RdbDatabase       = 0
)
