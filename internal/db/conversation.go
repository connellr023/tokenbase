package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

// Creates a new conversation in the database
//
// Parameters:
// - sdb: A pointer to the surrealdb database instance
// - name: The name of the conversation
// - userID: The user ID of the conversation owner
//
// Returns:
// - The created conversation
// - An error if the conversation could not be created
func NewConversation(sdb *surrealdb.DB, name string, userID string) (models.DbConversation, error) {
	const query = "INSERT INTO conversations (name, user_id) VALUES ($name, <record>$user_id) RETURN AFTER"
	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"name":    name,
		"user_id": userID,
	})

	if err != nil {
		return models.DbConversation{}, err
	}

	conversations, err := validateArrayQueryResult(res)

	if err != nil {
		return models.DbConversation{}, err
	}

	return conversations[0], nil
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
	const query = "SELECT * FROM conversations WHERE user_id = <record>$user_id ORDER BY updated_at DESC"
	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"user_id": userID,
	})

	if err != nil {
		return nil, err
	}

	return validateArrayQueryResult(res)
}
