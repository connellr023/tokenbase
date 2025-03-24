package models

import (
	"time"

	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type Conversation struct {
	Id               models.RecordID `json:"id"`
	UserID           models.RecordID `json:"user_id"`
	ConversationName string          `json:"conversation_name"`
	CreatedAt        time.Time       `json:"created_at"`
	UpdatedAt        time.Time       `json:"updated_at"`
}
