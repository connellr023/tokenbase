package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

func (i *Injection) GetSystemPrompt(w http.ResponseWriter, r *http.Request) {
	// Verify the current user has admin privileges
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if !user.IsAdmin {
		http.Error(w, utils.ErrForbidden.Error(), http.StatusForbidden)
		return
	}

	// Get the system prompt
	systemPrompt, err := fetchSystemPrompt(i.Sdb, i.Rdb, r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// The ID is unecessary
	// This is to avoid making a new model
	response := models.ClientSystemPrompt{
		Prompt: systemPrompt,
	}

	// Send the response to the client
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
