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

// Removes a conversation (if owned by the user)
// and all its associated chat records from the database.
//
// Parameters:
// - sdb: A pointer to the surrealdb.DB instance
// - conversationID: The ID of the conversation to delete
// - userID: The user ID of the conversation owner
//
// Returns:
// - The deleted conversation
// - An error if the conversation or its chats could not be deleted
func DeleteConversation(sdb *surrealdb.DB, conversationID, userID string) (models.DbConversation, error) {
	// Use an IF check so only the conversation owner can delete.
	// If the conversation belongs to the user, we delete all associated chat records,
	// then delete the conversation itself, returning the deleted record(s).
	const query = `
		DELETE FROM conversations 
		WHERE id = <record>$conversation_id 
			AND user_id = <record>$user_id
		RETURN BEFORE;
		DELETE FROM chat_records 
		WHERE conversation_id = <record>$conversation_id;
	`

	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"conversation_id": conversationID,
		"user_id":         userID,
	})
	if err != nil {
		return models.DbConversation{}, err
	}

	// If the query response is missing or malformed, treat it as a failure.
	if res == nil || len(*res) == 0 {
		return models.DbConversation{}, ErrQueryFailed
	}

	data := (*res)[0].Result

	// If no conversation was deleted, return ErrNoResults.
	if len(data) == 0 {
		return models.DbConversation{}, ErrNoResults
	}

	// Return the first (and only) deleted conversation.
	deletedConversation := data[0]
	return deletedConversation, nil
}
