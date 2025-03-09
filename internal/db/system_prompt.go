package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

// Gets the system prompt from persistent storage
//
// Parameters:
// - sdb: SurrealDB client
//
// Returns:
// - The system prompt
// - Any error that occurred
func GetSystemPrompt(sdb *surrealdb.DB) (string, error) {
	res, err := surrealdb.Select[models.GlobalSettings](sdb, globalSettingsMainRecord)

	if err != nil {
		return "", err
	}

	return res.Prompt, nil
}
