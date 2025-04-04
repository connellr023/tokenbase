package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
)

type getConversationsResponse struct {
	Conversations []models.ClientConversation `json:"conversations"`
}

func (i *Injection) GetConversations(w http.ResponseWriter, r *http.Request) {
	// Get user from JWT.
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Get all conversations for the user.
	conversations, err := db.GetAllConversations(i.Sdb, user.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert to client conversations.
	clientConversations := make([]models.ClientConversation, 0, len(conversations))

	for _, conversation := range conversations {
		clientConversations = append(clientConversations, conversation.ToClientConversation())
	}

	// Send the response.
	response := getConversationsResponse{
		Conversations: clientConversations,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
