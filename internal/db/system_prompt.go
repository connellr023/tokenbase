package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
	sdbModels "github.com/surrealdb/surrealdb.go/pkg/models"
)

var systemPromptRecordID = sdbModels.RecordID{
	Table: "system_prompt",
	ID:    "main",
}

// Gets the system prompt from persistent storage
//
// Parameters:
// - sdb: SurrealDB client
//
// Returns:
// - The system prompt
// - Any error that occurred
func GetSystemPrompt(sdb *surrealdb.DB) (string, error) {
	res, err := surrealdb.Select[models.DbSystemPrompt](sdb, systemPromptRecordID)

	if err != nil {
		return "", err
	}

	return res.Prompt, nil
}

func SetSystemPrompt(sdb *surrealdb.DB, prompt string) (string, error) {
	const query = "UPDATE system_prompt SET prompt = $prompt"
	_, err := surrealdb.Query[string](sdb, query, map[string]interface{}{
		"prompt": prompt,
	})
	if err != nil {
		return "", err
	}
	return prompt, nil
}
