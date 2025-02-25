package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"tokenbase/internal/utils"
)

type postPromptTempChatRequest struct {
	TempChatID string `json:"tempChatId"`
	Prompt     string `json:"prompt"`
}

// Multiple of these will be sent as a stream
type postPromptTempChatResponse struct {
	MessageID string `json:"messageId"`
	Token     string `json:"token"`
}

// Endpoint for sending a prompt on a temporary chat
// The temporary chat should already exist
func (i *Injection) PostPromptTempChat(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var req postPromptTempChatRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Construct request to Ollama API
	ollamaReq := utils.OllamaGenerateRequest{
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

	// Set headers for streaming response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Transfer-Encoding", "chunked")

	flusher, ok := w.(http.Flusher)

	if !ok {
		http.Error(w, "streaming is not supported!", http.StatusInternalServerError)
		return
	}

	// Read the response as a stream
	decoder := json.NewDecoder(ollamaRes.Body)

	for {
		var tokenMetadata utils.OllamaGenerateResponse

		if err := decoder.Decode(&tokenMetadata); err != nil {
			break
		}

		if tokenMetadata.IsDone {
			break
		}

		// Stream the response to the client
		res := postPromptTempChatResponse{
			MessageID: "sigmaboy", // For now, we don't have a message ID
			Token:     tokenMetadata.Response,
		}

		// Serialize response
		resJson, err := json.Marshal(res)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Write response to client
		w.Write(resJson)
		w.Write([]byte("\n"))

		// Flush the buffer to ensure the chunk is sent
		flusher.Flush()
	}
}
