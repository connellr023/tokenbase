package utils_test

import (
	"reflect"
	"testing"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

func TestBuildOllamaMessagesConstructsCorrectly(t *testing.T) {
	systemPrompt := "System prompt"
	newPrompt := "New prompt"
	newImages := []string{"dslkfjgklofdg", "dlfdgnjlkfgbhlk"}

	records := []models.ClientChatRecord{
		{
			Prompt: "Prompt 1",
			Reply:  "Answer 1",
		},
		{
			Prompt: "Prompt 2",
			Reply:  "Answer 2",
		},
	}

	expectedMessages := []models.OllamaChatMessage{
		{
			Role:    models.SystemRole,
			Content: systemPrompt,
		},
		{
			Role:    models.UserRole,
			Content: "Prompt 1",
		},
		{
			Role:    models.AssistantRole,
			Content: "Answer 1",
		},
		{
			Role:    models.UserRole,
			Content: "Prompt 2",
		},
		{
			Role:    models.AssistantRole,
			Content: "Answer 2",
		},
		{
			Role:    models.UserRole,
			Content: newPrompt,
			Images:  newImages,
		},
	}

	messages := utils.BuildOllamaMessages(systemPrompt, newPrompt, newImages, records)

	if !reflect.DeepEqual(messages, expectedMessages) {
		t.Errorf("Expected %v, but got %v", expectedMessages, messages)
	}
}
