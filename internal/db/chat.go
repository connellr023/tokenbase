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
	const query = "SELECT * FROM chat_records WHERE conversation_id = <record>$conversation_id ORDER BY CREATED_AT DESC"
	res, err := surrealdb.Query[[]models.DbChatRecord](sdb, query, map[string]any{
		"conversation_id": conversationID,
	})

	if err != nil {
		return nil, err
	}

	if res == nil || len(*res) == 0 {
		return nil, ErrNoResults
	}

	chats := (*res)[0].Result
	return chats, nil
}

// Save a chat record to the database
//
// Parameters:
// - sdb: a surrealdb database instance
// - prompt: the prompt of the chat record
// - promptImages: the images associated with the prompt
// - reply: the reply to the prompt
// - conversationID: the ID of the conversation
//
// Returns:
// - The saved chat record
// - An error if the chat record could not be saved
func SaveChatRecord(sdb *surrealdb.DB, prompt string, promptImages []string, reply string, createdAt int64, userID string, conversationID string) (models.DbChatRecord, error) {
	const query = "IF (<record>$conversation_id).user_id = <record>$user_id THEN (INSERT INTO chat_records (conversation_id, prompt, prompt_images, reply, created_at) VALUES (<record>$conversation_id, $prompt, $prompt_images, $reply, $created_at) RETURN AFTER) ELSE ([]) END"
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

	if res == nil || len(*res) == 0 {
		return models.DbChatRecord{}, ErrQueryFailed
	}

	data := (*res)[0].Result

	if len(data) == 0 {
		return models.DbChatRecord{}, ErrNoResults
	}

	chat := data[0]
	return chat, nil
}
