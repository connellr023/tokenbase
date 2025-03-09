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

// Converts a chat record to a pair of Ollama compatible chat messages
//
// Returns:
// - A pair of Ollama compatible chat messages
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

// Creates a list of Ollama compatible chat messages from a list of chat records
// Additionally, it appends a new prompt to the end of the list
//
// Parameters:
// - newPrompt: The new prompt to append to the end of the list
// - records: A list of chat records to convert to Ollama messages
//
// Returns:
// - A list of Ollama compatible chat messages
func BuildOllamaMessages(newPrompt string, records ...ChatRecord) []OllamaChatMessage {
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
