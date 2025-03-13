package controllers

import (
	"encoding/json"
	"math/rand"
	"net/http"
)

var suggestions = [...]string{
	"Tell me a joke",
	"What is the meaning of life?",
	"Why is the sky blue?",
	"What is the capital of Assyria?",
	"Why do we dream?",
	"Where do babies come from?",
}

func (i *Injection) GetChatSuggestions(w http.ResponseWriter, r *http.Request) {
	n := max(rand.Intn(len(suggestions)), 2)

	// Create a randomly sized subset of suggestions
	subset := make([]string, n)
	copy(subset, suggestions[:])

	// Shuffle the subset
	rand.Shuffle(len(subset), func(i, j int) {
		subset[i], subset[j] = subset[j], subset[i]
	})

	// Encode the subset as JSON
	json, err := json.Marshal(subset)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write the JSON to the response
	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}
