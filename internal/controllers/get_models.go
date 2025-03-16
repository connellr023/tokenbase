package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

func (i *Injection) GetModels(w http.ResponseWriter, r *http.Request) {
	// Get the models from the Ollama API
	res, err := http.Get(utils.OllamaDockerTagsEndpoint)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Decode the response
	var tags models.OllamaTagsResponse

	if err := json.NewDecoder(res.Body).Decode(&tags); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Map the response to just a list of model names
	modelNames := make([]string, len(tags.Models))

	for i, model := range tags.Models {
		modelNames[i] = model.Name
	}

	// Encode as JSON
	json, err := json.Marshal(modelNames)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write the JSON to the response
	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}
