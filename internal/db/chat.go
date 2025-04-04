package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

// Retrieve all chat records from a conversation
//
// Parameters:
//
//	sdb: a surrealdb database instance
//	conversationID: the ID of the conversation
//
// Returns:
//
//	A list of chat records
//	An error if the chat records could not be retrieved
func GetAllChatRecordsFromConversation(sdb *surrealdb.DB, conversationID string) ([]models.DbChatRecord, error) {
	const query = `
		SELECT * FROM chat_records
		WHERE conversation_id = <record>$conversation_id
		ORDER BY created_at DESC
	`

	res, err := surrealdb.Query[[]models.DbChatRecord](sdb, query, map[string]any{
		"conversation_id": conversationID,
	})

	if err != nil {
		return nil, err
	}

	return validateArrayQueryResult(res)
}

// Save a chat record to the database.
//
// Parameters:
// - sdb: a surrealdb database instance.
// - prompt: the prompt of the chat record.
// - promptImages: the images associated with the prompt.
// - reply: the reply to the prompt.
// - conversationID: the ID of the conversation.
//
// Returns:
// - The saved chat record.
// - An error if the chat record could not be saved.
func SaveChatRecord(sdb *surrealdb.DB, prompt string, promptImages []string, reply string, createdAt int64, userID string, conversationID string) (models.DbChatRecord, error) {
	const query = `
		IF (<record>$conversation_id).user_id = <record>$user_id THEN (
			INSERT INTO chat_records (
				conversation_id, 
				prompt, 
				prompt_images, 
				reply, 
				created_at
			) VALUES (
				<record>$conversation_id, 
				$prompt, 
				$prompt_images, 
				$reply, 
				$created_at
			) RETURN AFTER
		) ELSE ([]) END
	`
	res, err := surrealdb.Query[[]models.DbChatRecord](sdb, query, map[string]any{
		"conversation_id": conversationID,
		"user_id":         userID,
		"prompt":          prompt,
		"prompt_images":   promptImages,
		"reply":           reply,
		"created_at":      createdAt,
	})

	if err != nil {
		return models.DbChatRecord{}, err
	}

	var chat models.DbChatRecord
	err = validateSingleQueryResult(res, &chat)
	return chat, err
}

// Delete a chat record from the database by its creation time.
//
// Parameters:
// - sdb: a surrealdb database instance.
// - createdAt: the creation time of the chat record.
// - userID: the ID of the user.
// - conversationID: the ID of the conversation.
//
// Returns:
// - The deleted chat record.
// - An error if the chat record could not be deleted.
func DeleteChatRecordByCreationTime(sdb *surrealdb.DB, createdAt int64, userID string, conversationID string) (models.DbChatRecord, error) {
	const query = `
		IF (<record>$conversation_id).user_id = <record>$user_id THEN (
			DELETE FROM chat_records 
			WHERE conversation_id = <record>$conversation_id 
			AND created_at = $created_at 
			RETURN AFTER
		) ELSE ([]) END
	`

	res, err := surrealdb.Query[[]models.DbChatRecord](sdb, query, map[string]any{
		"conversation_id": conversationID,
		"user_id":         userID,
		"created_at":      createdAt,
	})

	if err != nil {
		return models.DbChatRecord{}, err
	}

	var chat models.DbChatRecord
	err = validateSingleQueryResult(res, &chat)
	return chat, err
}
