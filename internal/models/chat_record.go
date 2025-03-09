package models

// Represents a single back-and-forth chat record
// Will be used to represent a chat record in both Redis and SurrealDB
type ChatRecord struct {
	ChatId int64  `json:"chatId"`
	Prompt string `json:"prompt"`
	Reply  string `json:"reply"`
}

// Converts a chat record to a pair of Ollama compatible chat messages
//
// Returns:
// - A pair of Ollama compatible chat messages
func (c *ChatRecord) ToOllamaMessages() (OllamaChatMessage, OllamaChatMessage) {
	userMessage := OllamaChatMessage{
		Role:    UserRole,
		Content: c.Prompt,
	}

	assistantMessage := OllamaChatMessage{
		Role:    AssistantRole,
		Content: c.Reply,
	}

	return userMessage, assistantMessage
}
