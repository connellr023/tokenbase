package controllers

import (
	"encoding/json"
	"net/http"
	"sync"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
)

type deleteConversationChatRequest struct {
	CreatedAt      int64  `json:"createdAt"`
	ConversationID string `json:"conversationId"`
}

func (i *Injection) DeleteConversationChat(w http.ResponseWriter, r *http.Request) {
	// Extract user from JWT
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request
	var req deleteConversationChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Aggregate deletion of chat record in database and cache
	wg := sync.WaitGroup{}
	wg.Add(2)
	errorChan := make(chan error, 2)

	// Delete chat record in database
	go func() {
		defer wg.Done()

		if _, err := db.DeleteChatRecordByCreationTime(i.Sdb, req.CreatedAt, user.ID, req.ConversationID); err != nil {
			errorChan <- err
		}
	}()

	// Delete chat record in cache
	go func() {
		defer wg.Done()

		conversationKey := cache.FmtConversationKey(user.ID, req.ConversationID)

		if err := cache.DeleteChatRecord(i.Rdb, conversationKey, req.CreatedAt, r.Context()); err != nil {
			errorChan <- err
		}
	}()

	go func() {
		wg.Wait()
		close(errorChan)
	}()

	// Check for errors
	for err := range errorChan {
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
