package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
)

// the payload to delete a conversation.
type deleteConversationRequest struct {
	ConversationID string `json:"conversationId"`
}

// DeleteUserConversation handles deletion of a user's conversation and its associated chat records.
// It deletes data both from the database and the Redis cache.
func (i *Injection) DeleteUserConversation(w http.ResponseWriter, r *http.Request) {
	// Extract user from JWT.
	user, err := middlewares.GetUserFromJwt(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request payload.
	var req deleteConversationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Aggregate deletion from the database and cache using a WaitGroup.
	wg := sync.WaitGroup{}
	wg.Add(2)
	errorChan := make(chan error, 2)

	// Delete conversation in the database.
	go func() {
		defer wg.Done()
		if _, err := db.DeleteConversation(i.Sdb, req.ConversationID, user.ID); err != nil {
			errorChan <- err
		}
	}()

	// Delete conversation cache (its chat records) from Redis.
	go func() {
		defer wg.Done()
		conversationKey := cache.FmtConversationKey(user.ID, req.ConversationID)
		ctx := context.Background()
		if err := i.Rdb.Del(ctx, conversationKey).Err(); err != nil {
			errorChan <- err
		}
	}()

	// Wait for both deletions to finish and close errorChan.
	go func() {
		wg.Wait()
		close(errorChan)
	}()

	// Check for any errors.
	for err := range errorChan {
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Respond with no content on successful deletion.
	w.WriteHeader(http.StatusNoContent)
}
