package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

// Creates a new conversation in the database.
//
// Parameters:
// - sdb: A pointer to the surrealdb database instance.
// - name: The name of the conversation.
// - userID: The user ID of the conversation owner.
//
// Returns:
// - The created conversation.
// - An error if the conversation could not be created.
func NewConversation(sdb *surrealdb.DB, name string, userID string) (models.DbConversation, error) {
	const query = `
		INSERT INTO conversations (name, user_id)
		VALUES ($name, <record>$user_id)
		RETURN AFTER
	`

	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"name":    name,
		"user_id": userID,
	})

	if err != nil {
		return models.DbConversation{}, err
	}

	var conversation models.DbConversation
	err = validateSingleQueryResult(res, &conversation)

	return conversation, err
}

// Gets all conversations for a user.
//
// Parameters:
// - sdb: A pointer to the surrealdb.DB instance.
// - userID: The user ID of the conversation owner.
//
// Returns:
// - A list of conversations.
// - An error if the conversations could not be retrieved.
func GetAllConversations(sdb *surrealdb.DB, userID string) ([]models.DbConversation, error) {
	const query = `
		SELECT * FROM conversations
		WHERE user_id = <record>$user_id
		ORDER BY updated_at DESC
	`

	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"user_id": userID,
	})

	if err != nil {
		return nil, err
	}

	return validateArrayQueryResult(res)
}

// Removes a conversation (if owned by the user).
// And all its associated chat records from the database.
//
// Parameters:
// - sdb: A pointer to the surrealdb.DB instance.
// - conversationID: The ID of the conversation to delete.
// - userID: The user ID of the conversation owner.
//
// Returns:
// - The deleted conversation.
// - An error if the conversation or its chats could not be deleted.
func DeleteConversation(sdb *surrealdb.DB, conversationID, userID string) (models.DbConversation, error) {
	// Ownership of the conversation is checked in the first query.
	// If the user is not the owner, the transaction will fail.
	// The transaction will also delete all chat records associated with the conversation.
	const query = `
		BEGIN TRANSACTION;
		DELETE FROM conversations 
		WHERE id = <record>$conversation_id AND user_id = <record>$user_id
		RETURN AFTER;
		DELETE FROM chat_records 
		WHERE conversation_id = <record>$conversation_id;
		COMMIT TRANSACTION;
	`

	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"conversation_id": conversationID,
		"user_id":         userID,
	})

	if err != nil {
		return models.DbConversation{}, err
	}

	var conversation models.DbConversation
	err = validateSingleQueryResult(res, &conversation)

	return conversation, err
}

// Renames a conversation if owned by the user.
//
// Parameters:
// - sdb: A pointer to the surrealdb.DB instance.
// - conversationID: The ID of the conversation to rename.
// - userID: The user ID of the conversation owner.
// - newName: The new name of the conversation.
//
// Returns:
// - The renamed conversation.
// - An error if the conversation or its chats could not be renamed.
func RenameConversation(sdb *surrealdb.DB, conversationID, userID string, newName string) (models.DbConversation, error) {
	const query = `
		UPDATE conversations
		SET name = $name, updated_at = time::millis()
		WHERE id = <record>$conversation_id AND user_id = <record>$user_id;
	`

	res, err := surrealdb.Query[[]models.DbConversation](sdb, query, map[string]any{
		"name":            newName,
		"conversation_id": conversationID,
		"user_id":         userID,
	})

	if err != nil {
		return models.DbConversation{}, err
	}

	var conversation models.DbConversation
	err = validateSingleQueryResult(res, &conversation)

	return conversation, err
}
