package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/cache"
)

type postGuestSessionResponse struct {
	GuestSessionId string `json:"guestSessionId"`
}

// Endpoint requesting a new guest session be created
// Guest sessions will only live in Redis
func (i *Injection) PostGuestSession(w http.ResponseWriter, r *http.Request) {
	// Generate guest session ID
	id, err := cache.NewGuestSession(i.Rdb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the guest session ID
	res := postGuestSessionResponse{
		GuestSessionId: id,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
