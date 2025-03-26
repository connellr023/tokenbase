package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type postConversationRequest struct {
	Model       string `json:"model"`
	FirstPrompt string `json:"firstPrompt"`
}

type postConversationResponse struct {
	Conversation models.ClientConversation `json:"conversation"`
}

func (i *Injection) PostConversation(w http.ResponseWriter, r *http.Request) {
	// Get user from JWT
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request
	var req postConversationRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Ask Ollama to generate a name for the conversation based on the first prompt
	prompt := "Generate a concise title for this prompt and nothing else: " + req.FirstPrompt
	ollamaReq := models.OllamaGenerateRequest{
		Model:  req.Model,
		Prompt: prompt,
		Stream: false,
	}

	// Serialize request
	ollamaReqJson, err := json.Marshal(ollamaReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ollamaRes, err := http.Post(utils.OllamaDockerGenerateEndpoint, "application/json", bytes.NewBuffer(ollamaReqJson))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer ollamaRes.Body.Close()

	// Parse response
	res := models.OllamaGenerateResponse{}

	if err := json.NewDecoder(ollamaRes.Body).Decode(&res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create conversation
	dbConversation, err := db.NewConversation(i.Sdb, res.Response, user.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Compose response
	clientConversation, ok := dbConversation.ToClientConversation()

	if !ok {
		http.Error(w, ErrInvalidID.Error(), http.StatusInternalServerError)
		return
	}

	clientRes := postConversationResponse{
		Conversation: clientConversation,
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(clientRes); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
