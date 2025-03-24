package models

import "github.com/surrealdb/surrealdb.go/pkg/models"

type SurrealGlobalSettings struct {
	ID     models.RecordID `json:"id"`
	Prompt string          `json:"prompt"`
}
