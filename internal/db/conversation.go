package db

import (
	"fmt"
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
	sdbModels "github.com/surrealdb/surrealdb.go/pkg/models"
)

// Creates a new conversation in the database
//
// Parameters:
// - sdb: A pointer to the surrealdb.DB instance
// - name: The name of the conversation
// - userID: The user ID of the conversation owner
//
// Returns:
// - The created conversation
// - An error if the conversation could not be created
func NewConversation(sdb *surrealdb.DB, name string, userID string) (models.DbConversation, error) {
	conversation, err := surrealdb.Create[models.DbConversation](sdb, sdbModels.Table("conversations"), map[string]any{
		"name":    name,
		"user_id": userID,
	})

	if err != nil {
		return models.DbConversation{}, err
	}

	if conversation == nil {
		return models.DbConversation{}, fmt.Errorf("failed to create conversation")
	}

	return *conversation, nil
}

// Gets all conversations for a user
//
// Parameters:
// - sdb: A pointer to the surrealdb.DB instance
// - userID: The user ID of the conversation owner
//
// Returns:
// - A list of conversations
// - An error if the conversations could not be retrieved
func GetAllConversations(sdb *surrealdb.DB, userID string) ([]models.DbConversation, error) {
	const query = "SELECT * FROM conversations WHERE user_id = $user_id"
	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"user_id": userID,
	})

	if err != nil {
		return nil, err
	}

	if len(*res) == 0 {
		return nil, ErrNoResults
	}

	conversations := (*res)[0].Result
	return conversations, nil
}
