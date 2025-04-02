package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
)

type patchRenameConversationRequest struct {
	ConversationID string `json:"conversationId"`
	Name           string `json:"name"`
}

type patchRenameConversationResponse struct {
	Conversation models.ClientConversation `json:"conversation"`
}

func (i *Injection) PatchRenameUserConversation(w http.ResponseWriter, r *http.Request) {
	// Extract user from JWT.
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request payload.
	var req patchRenameConversationRequest

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

	res := patchRenameConversationResponse{
		Conversation: clientConversation,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
