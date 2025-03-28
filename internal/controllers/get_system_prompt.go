package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/utils"
)

type SystemPromptResponse struct {
	Prompt string `json:"prompt"`
}

func (i *Injection) GetSystemPrompt(w http.ResponseWriter, r *http.Request) {

	// Get the system prompt
	systemPrompt, err := utils.FetchSystemPrompt(i.Sdb, i.Rdb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// The ID is unecessary
	// This is to avoid making a new model
	response := SystemPromptResponse{
		Prompt: systemPrompt,
	}

	// Send the response to the client
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
