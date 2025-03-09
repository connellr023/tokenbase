package models

import "github.com/surrealdb/surrealdb.go/pkg/models"

// Represents the global settings table in `02_global_settings.surql`
type GlobalSettings struct {
	Id     models.RecordID `json:"id"`
	Prompt string          `json:"prompt"`
}
