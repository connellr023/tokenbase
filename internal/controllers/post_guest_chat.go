package controllers

import (
	"bytes"
	"encoding/json"
	"math/rand"
	"net/http"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type guestChatRequest struct {
	GuestSessionId int    `json:"guestSessionId"`
	Prompt         string `json:"prompt"`
}

// Endpoint for sending a prompt on a guest chat
// The guest chat should already exist
func (i *Injection) PostGuestChat(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var req guestChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Construct request to Ollama API
	ollamaReq := models.OllamaGenerateRequest{
		Model:  utils.TinyLlamaModelName,
		Prompt: req.Prompt,
		Stream: true,
	}

	// Serialize request to Ollama API
	ollamaReqJson, err := json.Marshal(ollamaReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send request to Ollama API
	ollamaRes, err := http.Post(utils.TinyLlamaDockerEndpoint, "application/json", bytes.NewBuffer(ollamaReqJson))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer ollamaRes.Body.Close()

	// Generate chat ID
	// Random for now...
	chatId := rand.Intn(10000)

	// Stream the response to the client
	err = utils.ProcessHttpStream(w, ollamaRes.Body, func(data models.OllamaGenerateResponse) (models.ChatToken, error) {
		chatToken := models.ChatToken{
			ChatId: chatId,
			Token:  data.Response,
		}

		return chatToken, nil
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
