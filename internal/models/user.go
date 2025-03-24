package models

import (
	"time"

	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type User struct {
	ID           models.RecordID `json:"id"`
	Username     string          `json:"username"`
	Email        string          `json:"email"`
	PasswordHash string          `json:"password_hash"`
	IsAdmin      bool            `json:"is_admin"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}
