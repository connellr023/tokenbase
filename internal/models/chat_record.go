package models

const (
	userRoleName      = "user"
	assistantRoleName = "assistant"
)

// Represents a single back-and-forth chat record
// Will be used to represent a chat record in both Redis and SurrealDB
type ChatRecord struct {
	ChatId int64  `json:"chatId"`
	Prompt string `json:"prompt"`
	Reply  string `json:"reply"`
}

func (c *ChatRecord) ToOllamaMessages() (OllamaChatMessage, OllamaChatMessage) {
	userMessage := OllamaChatMessage{
		Role:    userRoleName,
		Content: c.Prompt,
	}

	assistantMessage := OllamaChatMessage{
		Role:    assistantRoleName,
		Content: c.Reply,
	}

	return userMessage, assistantMessage
}

func BuildOllamaMessages(records []ChatRecord, newPrompt string) []OllamaChatMessage {
	n := (len(records) * 2) + 1
	messages := make([]OllamaChatMessage, 0, n)

	for _, record := range records {
		userMessage, assistantMessage := record.ToOllamaMessages()
		messages = append(messages, userMessage, assistantMessage)
	}

	newMessage := OllamaChatMessage{
		Role:    userRoleName,
		Content: newPrompt,
	}

	messages = append(messages, newMessage)
	return messages
}
