package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/utils"
)

type deleteGuestChatRequest struct {
	CreatedAt int64 `json:"createdAt"`
}

func (i *Injection) DeleteGuestChat(w http.ResponseWriter, r *http.Request) {
	// Extract token (guest session ID) from request
	token, ok := middlewares.GetBearerFromContext(r.Context())

	if !ok {
		http.Error(w, utils.ErrBearerTokenNotFound.Error(), http.StatusUnauthorized)
		return
	}

	// Parse request body
	var req deleteGuestChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Delete chat record
	guestSessionKey := cache.FmtGuestSessionKey(token)

	if err := cache.DeleteChatRecord(i.Rdb, guestSessionKey, req.CreatedAt, r.Context()); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
