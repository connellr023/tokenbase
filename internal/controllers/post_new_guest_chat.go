package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
)

type newGuestChatResponse struct {
	GuestSessionId string `json:"guestSessionId"`
}

// Endpoint requesting a new guest chat be created
// Guest chats will only live in Redis
func (i *Injection) PostNewGuestChat(w http.ResponseWriter, r *http.Request) {
	// Generate guest session ID
	id, err := cache.NewGuestSession(i.Rdb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the guest session ID
	res := newGuestChatResponse{
		GuestSessionId: id,
	}

	resJson, err := json.Marshal(res)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(resJson)
}
