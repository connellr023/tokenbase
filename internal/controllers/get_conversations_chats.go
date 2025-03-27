package controllers

import (
	"net/http"
)

// type getConversationChatsResponse struct {
// 	Chats []models.ClientChatRecord `json:"chats"`
// }

func (i *Injection) GetConversationChats(w http.ResponseWriter, r *http.Request) {
	// // Extract the conversation ID from the URL
	// conversationID := chi.URLParam(r, "conversation_id")

	// // Get all dbChats from the conversation
	// dbChats, err := db.GetAllChatsFromConversation(i.Sdb, conversationID)

	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// // Convert the chat records to client chat records
	// clientChats := make([]models.ClientChatRecord, 0, len(dbChats))

	// for _, dbChat := range dbChats {
	// 	clientChats = append(clientChats, dbChat.ToClientChatRecord())
	// }
}
