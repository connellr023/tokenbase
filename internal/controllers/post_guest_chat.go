package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"tokenbase/internal/cache"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type postGuestChatRequest struct {
	Prompt string `json:"prompt"`
}

// Endpoint for sending a prompt on a guest chat
// The guest chat should already exist
// The response will be streamed to the client in chunks
// The chat ID will be sent within the first chunk which will be used to identify that specific chat interaction
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
	chatId, systemPrompt, prevChatRecords, err := cache.GetChatContext(i.Rdb, guestSessionKey)

	if errors.Is(err, cache.ErrSessionNotFound) {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Construct request to Ollama API
	ollamaReq := models.OllamaChatRequest{
		Model:    utils.TinyLlamaModelName,
		Messages: models.BuildOllamaMessages(systemPrompt, req.Prompt, prevChatRecords),
		Stream:   true,
	}

	// Serialize request to Ollama API
	ollamaReqJson, err := json.Marshal(ollamaReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send request to Ollama API
	ollamaRes, err := http.Post(utils.TinyLlamaDockerChatEndpoint, "application/json", bytes.NewBuffer(ollamaReqJson))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer ollamaRes.Body.Close()

	// Keep track of the LLM's reply so far
	var replyBuilder strings.Builder

	// Stream the response to the client
	{
		hasSentChatId := false

		err = utils.MapHttpStream(w, ollamaRes.Body, r.Context(), func(data models.OllamaChatResponse) models.ChatToken {
			// Append response to the reply string
			replyBuilder.WriteString(data.Message.Content)

			// Determine if chat ID has been sent
			if !hasSentChatId {
				hasSentChatId = true

				return models.ChatToken{
					ChatId: chatId,
					Token:  data.Message.Content,
				}
			}

			// No need to send chat ID again
			return models.ChatToken{
				Token: data.Message.Content,
			}
		})

		if err != nil && !errors.Is(err, utils.ErrStreamAborted) {
			utils.WriteChatError(w, err)
			return
		}
	}

	// Check if the chat was cancelled before any reply was sent
	if replyBuilder.Len() == 0 {
		// Do not bother saving the chat record
		return
	}

	// Cache chat in Redis
	record := models.ChatRecord{
		ChatId: chatId,
		Prompt: req.Prompt,
		Reply:  replyBuilder.String(),
	}

	if err := cache.SaveChatRecord(i.Rdb, guestSessionKey, record); err != nil {
		utils.WriteChatError(w, err)
		return
	}
}
