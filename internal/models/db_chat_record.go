package models

import (
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type DbChatRecord struct {
	ID             models.RecordID `json:"id"`
	ConversationID models.RecordID `json:"conversation_id"`
	Prompt         string          `json:"prompt"`
	PromptImages   []string        `json:"prompt_images"`
	Reply          string          `json:"reply"`
	CreatedAt      int64           `json:"created_at"`
}

func (c DbChatRecord) ToClientChatRecord() ClientChatRecord {
	return ClientChatRecord{
		Prompt:       c.Prompt,
		PromptImages: c.PromptImages,
		Reply:        c.Reply,
		CreatedAt:    c.CreatedAt,
	}
}
