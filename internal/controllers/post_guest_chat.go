package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
	"tokenbase/internal/cache"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type postGuestChatRequest struct {
	Prompt string   `json:"prompt"`
	Images []string `json:"images"`
	Model  string   `json:"model"`
}

// Endpoint for sending a prompt on a guest chat.
// The guest chat should already exist.
func (i *Injection) PostGuestChat(w http.ResponseWriter, r *http.Request) {
	// Extract token (guest session ID) from request.
	token, ok := middlewares.GetBearerFromContext(r.Context())

	if !ok {
		http.Error(w, utils.ErrBearerTokenNotFound.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request body.
	var req postGuestChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check context of conversation.
	guestSessionKey := cache.FmtGuestSessionKey(token)
	prevChatRecords, err := cache.GetAllChats(r.Context(), i.Rdb, guestSessionKey)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get the system prompt.
	systemPrompt, err := fetchSystemPrompt(r.Context(), i.Sdb, i.Rdb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Construct request to Ollama API.
	ollamaReq := models.OllamaChatRequest{
		Model:    req.Model,
		Messages: utils.BuildOllamaMessages(systemPrompt, req.Prompt, req.Images, prevChatRecords),
		Stream:   true,
	}

	// Serialize request to Ollama API.
	ollamaReqJSON, err := json.Marshal(ollamaReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send request to Ollama API.
	ollamaRes, err := http.Post(utils.OllamaDockerChatEndpoint, "application/json", bytes.NewBuffer(ollamaReqJSON))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer func() {
		_ = ollamaRes.Body.Close()
	}()

	// Set creation time of the chat.
	creationTime := time.Now().UnixMilli()
	var replyBuilder strings.Builder

	// Stream the response to the client.
	{
		err := MapHTTPStream(r.Context(), w, ollamaRes.Body, func(data models.OllamaChatResponse) models.ChatToken {
			replyBuilder.WriteString(data.Message.Content)

			return models.ChatToken{
				CreatedAt: creationTime,
				Token:     data.Message.Content,
			}
		})

		if err != nil && !errors.Is(err, utils.ErrStreamAborted) {
			WriteStreamError(w, err)
			return
		}
	}

	// Check if the chat was cancelled before any reply was sent.
	if replyBuilder.Len() == 0 {
		// Do not bother saving the chat record.
		return
	}

	// Cache chat in Redis.
	record := models.ClientChatRecord{
		CreatedAt:    creationTime,
		Prompt:       req.Prompt,
		PromptImages: req.Images,
		Reply:        replyBuilder.String(),
	}

	if err := cache.SaveChatRecords(r.Context(), i.Rdb, guestSessionKey, record); err != nil {
		WriteStreamError(w, err)
		return
	}
}
