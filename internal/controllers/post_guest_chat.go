package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type postGuestChatRequest struct {
	Prompt string `json:"prompt"`
	Model  string `json:"model"`
}

// Endpoint for sending a prompt on a guest chat
// The guest chat should already exist
// The response will be streamed to the client in chunks
// The chat creation time will be sent within the first chunk which will be used to identify that specific chat interaction
func (i *Injection) PostGuestChat(w http.ResponseWriter, r *http.Request) {
	// Extract token (guest session ID) from request
	token, ok := middlewares.GetBearerFromContext(r.Context())

	if !ok {
		http.Error(w, ErrBearerTokenNotFound.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request body
	var req postGuestChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check context of conversation
	guestSessionKey := cache.FmtGuestSessionKey(token)
	prevChatRecords, err := cache.GetChatContext(i.Rdb, guestSessionKey)

	if errors.Is(err, cache.ErrSessionNotFound) {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get the system prompt
	systemPrompt, err := cache.GetSystemPrompt(i.Rdb)

	if err != nil {
		// Try to get the system prompt from the database
		systemPrompt, err = db.GetSystemPrompt(i.Sdb)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Cache the system prompt
		if err := cache.SetSystemPrompt(i.Rdb, systemPrompt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Construct request to Ollama API
	ollamaReq := models.OllamaChatRequest{
		Model:    req.Model,
		Messages: utils.BuildOllamaMessages(systemPrompt, req.Prompt, prevChatRecords),
		Stream:   true,
	}

	// Serialize request to Ollama API
	ollamaReqJson, err := json.Marshal(ollamaReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send request to Ollama API
	ollamaRes, err := http.Post(utils.OllamaDockerChatEndpoint, "application/json", bytes.NewBuffer(ollamaReqJson))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer ollamaRes.Body.Close()

	// Set creation time of the chat
	creationTime := time.Now().UnixMilli()

	// Keep track of the LLM's reply so far
	var replyBuilder strings.Builder

	// Stream the response to the client
	{
		hasSentCreationTime := false

		err = utils.MapHttpStream(w, ollamaRes.Body, r.Context(), func(data models.OllamaChatResponse) models.ChatToken {
			// Append response to the reply string
			replyBuilder.WriteString(data.Message.Content)

			// Determine if the creation time should be sent
			if !hasSentCreationTime {
				hasSentCreationTime = true

				return models.ChatToken{
					CreatedAt: creationTime,
					Token:     data.Message.Content,
				}
			}

			// No need to send creation time again
			return models.ChatToken{
				Token: data.Message.Content,
			}
		})

		if err != nil && !errors.Is(err, utils.ErrStreamAborted) {
			utils.WriteStreamError(w, err)
			return
		}
	}

	// Check if the chat was cancelled before any reply was sent
	if replyBuilder.Len() == 0 {
		// Do not bother saving the chat record
		return
	}

	// Cache chat in Redis
	record := models.ClientChatRecord{
		CreatedAt: creationTime,
		Prompt:    req.Prompt,
		Reply:     replyBuilder.String(),
	}

	if err := cache.SaveChatRecords(i.Rdb, guestSessionKey, record); err != nil {
		utils.WriteStreamError(w, err)
		return
	}
}
