package models

import (
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type DbConversation struct {
	ID        models.RecordID `json:"id"`
	UserID    models.RecordID `json:"user_id"`
	Name      string          `json:"name"`
	CreatedAt int64           `json:"created_at"`
	UpdatedAt int64           `json:"updated_at"`
}

func (c DbConversation) ToClientConversation() ClientConversation {
	conversation := ClientConversation{
		ID:        c.ID.String(),
		UserID:    c.UserID.String(),
		Name:      c.Name,
		CreatedAt: c.CreatedAt,
		UpdatedAt: c.UpdatedAt,
	}

	return conversation
}
