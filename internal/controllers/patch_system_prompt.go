package controllers

import (
	"encoding/json"
	"net/http"
	"sync"
	"tokenbase/internal/cache"
	"tokenbase/internal/db"
	"tokenbase/internal/middlewares"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

func (i *Injection) PatchSystemPrompt(w http.ResponseWriter, r *http.Request) {
	// Verify the current user has admin privileges
	user, err := middlewares.GetUserFromJwt(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if !user.IsAdmin {
		http.Error(w, utils.ErrForbidden.Error(), http.StatusForbidden)
		return
	}

	// Parse request
	var req models.ClientSystemPrompt

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Aggregate saving the chat record in the database and cache
	wg := sync.WaitGroup{}
	wg.Add(2)
	errorChan := make(chan error, 2)

	// Send the request to the database
	go func() {
		defer wg.Done()

		if _, err = db.SetSystemPrompt(i.Sdb, req.Prompt); err != nil {
			errorChan <- err
		}
	}()

	// Update the system prompt in the cache
	go func() {
		defer wg.Done()

		if err = cache.SetSystemPrompt(i.Rdb, req.Prompt); err != nil {
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

	// Respond to the client
	w.WriteHeader(http.StatusOK)
}
