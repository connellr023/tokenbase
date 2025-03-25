package models

// Represents a single back-and-forth chat record
// Will be used to represent a chat record in both Redis and SurrealDB
type ClientChatRecord struct {
	ID           int64    `json:"id"`
	Prompt       string   `json:"prompt"`
	PromptImages []string `json:"promptImages,omitempty"` // Base64 encoded images
	Reply        string   `json:"reply"`
}

// Converts a chat record to a pair of Ollama compatible chat messages
//
// Returns:
// - A pair of Ollama compatible chat messages
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
