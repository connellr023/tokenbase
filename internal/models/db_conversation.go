package models

import (
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type DbConversation struct {
	ID        models.RecordID `json:"id"`
	UserID    string          `json:"user_id"`
	Name      string          `json:"name"`
	CreatedAt string          `json:"created_at"`
	UpdatedAt string          `json:"updated_at"`
}

func (c DbConversation) ToClientConversation() (ClientConversation, bool) {
	id, ok := c.ID.ID.(string)

	if !ok {
		return ClientConversation{}, false
	}

	conversation := ClientConversation{
		ID:        id,
		UserID:    c.UserID,
		Name:      c.Name,
		CreatedAt: c.CreatedAt,
		UpdatedAt: c.UpdatedAt,
	}

	return conversation, true
}
