package controllers

import (
	"encoding/json"
	"math/rand"
	"net/http"
)

func (i *Injection) GetChatSuggestions(w http.ResponseWriter, _ *http.Request) {
	suggestions := [...]string{
		"Tell me a joke.",
		"What is the meaning of life?",
		"Why is the sky blue?",
		"Why do we dream?",
		"Where do babies come from?",
		"What does the fox say?",
		"Who is the fairest of them all?",
		"Is there life on Mars?",
		"Who let the dogs out?",
		"Where is the beef?",
		"Who shot first?",
		"Who is the walrus?",
		"Is the cake a lie?",
		"What is the bite of '87?",
		"Who is the real Slim Shady?",
	}
	n := max(rand.Intn(len(suggestions)), 3) //nolint:gosec

	// Create a randomly sized subset of suggestions
	subset := make([]string, n)
	copy(subset, suggestions[:])

	// Shuffle the subset
	rand.Shuffle(len(subset), func(i, j int) {
		subset[i], subset[j] = subset[j], subset[i]
	})

	// Write the JSON to the response
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(subset); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
