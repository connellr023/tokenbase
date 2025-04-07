package models_test

import (
	"testing"
	"tokenbase/internal/models"
)

func TestToOllamaMessagesConstructsCorrectly(t *testing.T) {
	chat := models.ClientChatRecord{
		Prompt:       "Hello, how are you?",
		PromptImages: []string{"jlkdsjlof"},
		Reply:        "I'm fine, thank you!",
		CreatedAt:    1234567890,
	}

	userMessage, assistantMessage := chat.ToOllamaMessages()

	if userMessage.Role != models.UserRole {
		t.Errorf("Expected user message role to be %s, got %s", models.UserRole, userMessage.Role)
	}

	if userMessage.Content != chat.Prompt {
		t.Errorf("Expected user message content to be %s, got %s", chat.Prompt, userMessage.Content)
	}

	if userMessage.Images[0] != chat.PromptImages[0] {
		t.Errorf("Expected user message image to be %s, got %s", chat.PromptImages[0], userMessage.Images[0])
	}

	if assistantMessage.Role != models.AssistantRole {
		t.Errorf("Expected assistant message role to be %s, got %s", models.AssistantRole, assistantMessage.Role)
	}

	if assistantMessage.Content != chat.Reply {
		t.Errorf("Expected assistant message content to be %s, got %s", chat.Reply, assistantMessage.Content)
	}

	if len(assistantMessage.Images) != 0 {
		t.Errorf("Expected assistant message images to be empty, got %v", assistantMessage.Images)
	}
}
