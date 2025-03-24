package models

import (
	"time"

	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type Message struct {
	Id             models.RecordID `json:"id"`
	ConversationID models.RecordID `json:"conversation_id"`
	Sender         string          `json:"sender"`  // Expected values: "user", "assistant", "system"
	Content        string          `json:"content"`
	CreatedAt      time.Time       `json:"created_at"`
}
