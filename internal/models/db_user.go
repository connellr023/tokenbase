package models

import (
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type DbUser struct {
	ID           models.RecordID `json:"id"`
	Username     string          `json:"username"`
	Email        string          `json:"email"`
	PasswordHash string          `json:"password_hash"`
	IsAdmin      bool            `json:"is_admin"`
	CreatedAt    string          `json:"created_at"`
}

func (u DbUser) ToClientUser() ClientUser {
	clientUser := ClientUser{
		ID:        u.ID.String(),
		Email:     u.Email,
		Username:  u.Username,
		IsAdmin:   u.IsAdmin,
		CreatedAt: u.CreatedAt,
	}

	return clientUser
}
