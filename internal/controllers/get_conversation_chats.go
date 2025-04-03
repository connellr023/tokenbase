package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"

	"github.com/go-chi/chi/v5"
)

type getConversationChatsResponse struct {
	Chats []models.ClientChatRecord `json:"chats"`
}

func (i *Injection) GetConversationChats(w http.ResponseWriter, r *http.Request) {
	// Extract user from JWT
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Extract the conversation ID from the URL
	conversationID := chi.URLParam(r, "conversation_id")
	conversationKey := cache.FmtConversationKey(user.ID, conversationID)

	// Check if cache contains the client chat records
	if cacheClientChats, err := cache.GetAllChats(i.Rdb, conversationKey, r.Context()); err == nil {
		// Respond with the cached client chat records
		response := getConversationChatsResponse{
			Chats: cacheClientChats,
		}

		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		return
	} else {
		// Create a new conversation in cache
		if err := cache.NewChatSession(i.Rdb, conversationKey, r.Context()); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Get all conversation chats from the database
	dbChats, err := db.GetAllChatRecordsFromConversation(i.Sdb, conversationID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the chat records to client chat records
	clientChats := make([]models.ClientChatRecord, 0, len(dbChats))

	for _, dbChat := range dbChats {
		clientChats = append(clientChats, dbChat.ToClientChatRecord())
	}

	// Cache the client chat records in Redis
	if err := cache.SaveChatRecords(i.Rdb, conversationKey, r.Context(), clientChats...); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the client chat records
	response := getConversationChatsResponse{
		Chats: clientChats,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
