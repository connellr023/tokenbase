package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
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

	defer func() {
		_ = ollamaRes.Body.Close()
	}()

	// Parse response
	res := models.OllamaGenerateResponse{}

	if err := json.NewDecoder(ollamaRes.Body).Decode(&res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Filter out quote characters from the generated name
	filteredResponse := utils.FilterString(res.Response, func(r rune) bool {
		return r != '"' && r != '“' && r != '”'
	})

	// Create conversation
	dbConversation, err := db.NewConversation(i.Sdb, filteredResponse, user.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Compose response
	clientConversation := dbConversation.ToClientConversation()
	clientRes := postConversationResponse{
		Conversation: clientConversation,
	}

	// Create conversation in cache
	conversationKey := cache.FmtConversationKey(user.ID, clientConversation.ID)
	if err := cache.NewChatSession(i.Rdb, conversationKey, r.Context()); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(clientRes); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
