package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
	sdbModels "github.com/surrealdb/surrealdb.go/pkg/models"
)

// Gets the system prompt from persistent storage.
//
// Parameters:
// - sdb: SurrealDB client.
//
// Returns:
// - The system prompt.
// - Any error that occurred.
func GetSystemPrompt(sdb *surrealdb.DB) (string, error) {
	systemPromptRecordID := sdbModels.RecordID{
		Table: "system_prompt",
		ID:    "main",
	}
	res, err := surrealdb.Select[models.DbSystemPrompt](sdb, systemPromptRecordID)

	if err != nil {
		return "", err
	}

	return res.Prompt, nil
}

func SetSystemPrompt(sdb *surrealdb.DB, prompt string) (models.DbSystemPrompt, error) {
	const query = `
		UPDATE system_prompt
		SET prompt = $prompt
	`

	// Use a slice to handle the array response.
	res, err := surrealdb.Query[[]models.DbSystemPrompt](sdb, query, map[string]interface{}{
		"prompt": prompt,
	})

	if err != nil {
		return models.DbSystemPrompt{}, err
	}

	var promptRes models.DbSystemPrompt
	err = validateSingleQueryResult(res, &promptRes)

	return promptRes, err
}
