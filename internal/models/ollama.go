package models

type OllamaRole string

const (
	UserRole      = OllamaRole("user")
	AssistantRole = OllamaRole("assistant")
	SystemRole    = OllamaRole("system")
)

type OllamaChatMessage struct {
	Role    OllamaRole `json:"role"`
	Content string     `json:"content"`
	Images  string     `json:"images,omitempty"`
}

type OllamaChatRequest struct {
	Model     string              `json:"model"`
	KeepAlive int                 `json:"keep_alive,omitempty"`
	Messages  []OllamaChatMessage `json:"messages"`
	Stream    bool                `json:"stream,omitempty"`
}

type OllamaChatResponse struct {
	Model     string            `json:"model"`
	CreatedAt string            `json:"created_at"`
	Message   OllamaChatMessage `json:"message"`
	IsDone    bool              `json:"done"`
}

// Creates a list of Ollama compatible chat messages from a list of chat records
// Additionally, it appends a new prompt to the end of the list
//
// Parameters:
// - systemPrompt: The system prompt to put at the beginning of the list
// - newPrompt: The new prompt to append to the end of the list
// - records: A list of chat records to convert to Ollama messages
//
// Returns:
// - A list of Ollama compatible chat messages
func BuildOllamaMessages(systemPrompt string, newPrompt string, records []ChatRecord) []OllamaChatMessage {
	// Allocate enough space for the messages
	// 2 messages per record + 2 messages for the system prompt and the new prompt
	n := (len(records) * 2) + 2
	messages := make([]OllamaChatMessage, 0, n)

	// Add the system prompt
	{
		systemMessage := OllamaChatMessage{
			Role:    SystemRole,
			Content: systemPrompt,
		}

		messages = append(messages, systemMessage)
	}

	// Add the chat records
	for _, record := range records {
		userMessage, assistantMessage := record.ToOllamaMessages()
		messages = append(messages, userMessage, assistantMessage)
	}

	// Add the new prompt
	{
		newMessage := OllamaChatMessage{
			Role:    UserRole,
			Content: newPrompt,
		}

		messages = append(messages, newMessage)
	}

	return messages
}
