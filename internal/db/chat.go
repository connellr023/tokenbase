package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

func GetAllChatsFromConversation(sdb *surrealdb.DB, conversationID string) ([]models.DbChatRecord, error) {
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
