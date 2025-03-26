package models

import (
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type DbChatRecord struct {
	ID             models.RecordID `json:"id"`
	ConversationID string          `json:"conversation_id"`
	Prompt         string          `json:"prompt"`
	PromptImages   []string        `json:"prompt_images"`
	Reply          string          `json:"reply"`
}
