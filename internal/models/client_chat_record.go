package models

// Represents a single back-and-forth chat record.
// Will be used to represent a chat record in both Redis and SurrealDB.
type ClientChatRecord struct {
	Prompt       string   `json:"prompt"`
	PromptImages []string `json:"promptImages"` // Base64 encoded images.
	Reply        string   `json:"reply"`
	CreatedAt    int64    `json:"createdAt"` // Score used in Redis.
}

// Converts a chat record to a pair of Ollama compatible chat messages.
//
// Returns:
// - A pair of Ollama compatible chat messages.
func (c *ClientChatRecord) ToOllamaMessages() (OllamaChatMessage, OllamaChatMessage) {
	userMessage := OllamaChatMessage{
		Role:    UserRole,
		Content: c.Prompt,
		Images:  c.PromptImages,
	}

	assistantMessage := OllamaChatMessage{
		Role:    AssistantRole,
		Content: c.Reply,
	}

	return userMessage, assistantMessage
}
