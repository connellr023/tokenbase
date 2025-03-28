package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
)

type postSystemPrompt struct {
	Prompt string `json:"prompt"`
}

func (i *Injection) PostSystemPrompt(w http.ResponseWriter, r *http.Request) {

	// Parse request
	var req postSystemPrompt

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Send the request to the database
	_, err := db.SetSystemPrompt(i.Sdb, req.Prompt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update the system prompt in the cache
	err = cache.SetSystemPrompt(i.Rdb, req.Prompt)
	if err != nil {
		http.Error(w, "Failed to store prompt in Redis: "+err.Error(), http.StatusInternalServerError)
	}

	// Respond to the client
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("System prompt updated successfully"))
}
