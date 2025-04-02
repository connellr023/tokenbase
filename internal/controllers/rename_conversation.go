package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
)

type renameConversationRequest struct {
	ConversationID string `json:"conversationId"`
	Name           string `json:"name"`
}

type renameConversationResponse struct {
	Conversation models.ClientConversation `json:"conversation"`
}

// Handles deletion of a user's conversation and its associated chat records.
// It deletes data both from the database and the Redis cache.
func (i *Injection) RenameUserConversation(w http.ResponseWriter, r *http.Request) {
	// Extract user from JWT.
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request payload.
	var req renameConversationRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dbConversation, err := db.RenameConversation(i.Sdb, req.ConversationID, user.ID, req.Name)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	clientConversation := dbConversation.ToClientConversation()

	res := renameConversationResponse{
		Conversation: clientConversation,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
