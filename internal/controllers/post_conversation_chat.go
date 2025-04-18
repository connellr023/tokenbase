package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"sync"
	"time"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type postConversationChatRequest struct {
	Prompt         string   `json:"prompt"`
	Images         []string `json:"images"`
	Model          string   `json:"model"`
	ConversationID string   `json:"conversationId"`
}

func (i *Injection) PostConversationChat(w http.ResponseWriter, r *http.Request) {
	// Extract user from JWT
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request
	var req postConversationChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check context of conversation (expected to be cached)
	conversationKey := cache.FmtConversationKey(user.ID, req.ConversationID)
	prevChatRecords, err := cache.GetAllChats(r.Context(), i.Rdb, conversationKey)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get the system prompt
	systemPrompt, err := fetchSystemPrompt(r.Context(), i.Sdb, i.Rdb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Construct request to Ollama API
	ollamaReq := models.OllamaChatRequest{
		Model:    req.Model,
		Messages: utils.BuildOllamaMessages(systemPrompt, req.Prompt, req.Images, prevChatRecords),
		Stream:   true,
	}

	// Serialize request to Ollama API
	ollamaReqJSON, err := json.Marshal(ollamaReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send request to Ollama API
	ollamaRes, err := http.Post(utils.OllamaDockerChatEndpoint, "application/json", bytes.NewBuffer(ollamaReqJSON))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer func() {
		_ = ollamaRes.Body.Close()
	}()

	// Set creation time of the chat
	creationTime := time.Now().UnixMilli()

	// Keep track of the LLM's reply so far
	var replyBuilder strings.Builder

	// Stream the response to the client
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

	if replyBuilder.Len() == 0 {
		return
	}

	// Aggregate saving the chat record in the database and cache
	wg := sync.WaitGroup{}
	wg.Add(2)
	errorChan := make(chan error, 2)

	// Save chat record in the database
	go func() {
		defer wg.Done()

		if _, err := db.SaveChatRecord(i.Sdb, req.Prompt, req.Images, replyBuilder.String(), creationTime, user.ID, req.ConversationID); err != nil {
			errorChan <- err
		}
	}()

	// Cache chat record
	go func(ctx context.Context) {
		defer wg.Done()

		record := models.ClientChatRecord{
			CreatedAt:    creationTime,
			Prompt:       req.Prompt,
			PromptImages: req.Images,
			Reply:        replyBuilder.String(),
		}

		if err := cache.SaveChatRecords(ctx, i.Rdb, conversationKey, record); err != nil {
			errorChan <- err
		}
	}(r.Context())

	go func() {
		wg.Wait()
		close(errorChan)
	}()

	// Check for errors
	for err := range errorChan {
		WriteStreamError(w, err)
		return
	}
}
