package models

import (
	"time"

	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type DbConversation struct {
	ID        models.RecordID `json:"id"`
	UserID    models.RecordID `json:"user_id"`
	Name      string          `json:"name"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}
