package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
)

func (i *Injection) PatchSystemPrompt(w http.ResponseWriter, r *http.Request) {
	// Verify the current user has admin privileges
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil || !user.IsAdmin {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request
	var req models.ClientSystemPrompt

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Send the request to the database
	_, err = db.SetSystemPrompt(i.Sdb, req.Prompt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update the system prompt in the cache
	err = cache.SetSystemPrompt(i.Rdb, req.Prompt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Respond to the client
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("System prompt updated successfully"))
}
