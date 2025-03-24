package models

import (
	"time"

	"github.com/surrealdb/surrealdb.go/pkg/models"
)

type User struct {
	Id           models.RecordID `json:"id"`
	Username     string          `json:"username"`
	Email        string          `json:"email"`
	PasswordHash string          `json:"password_hash"`
	Role         string          `json:"role"` // Expected values: "guest", "user", "admin"
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}
