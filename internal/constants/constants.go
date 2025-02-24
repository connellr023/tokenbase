package constants

const BackendEndpoint = ":8090"

// SurrealDB connection details
const SdbDockerEndpoint = "ws://surrealdb:8000"
const SdbNamespace = "tokenbaseNS"
const SdbName = "tokenbaseDB"
const SdbUsername = "root" // Hardcoded for now
const SdbPassword = "root" // Hardcoded for now

// Redis connection details
const RdbDockerEndpoint = "redis:6379"
const RdbDatabase = 0
const RdbPassword = "password" // Hardcoded for now
