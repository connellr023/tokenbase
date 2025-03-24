package models

import (
	"time"

	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type Message struct {
	Id             models.RecordID `json:"id"`
	ConversationID models.RecordID `json:"conversation_id"`
	Prompt         string          `json:"prompt"`
	Reply          string          `json:"reply"`
	CreatedAt      time.Time       `json:"created_at"`
}
