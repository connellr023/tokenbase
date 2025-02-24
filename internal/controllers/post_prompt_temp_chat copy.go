package controllers

import "net/http"

type postPromptTempChatRequest struct {
	ChatID string `json:"chat_id"`
	Prompt string `json:"prompt"`
}

// Multiple of these will be sent as a stream
type postPromptTempChatResponse struct {
	MessageID string `json:"message_id"`
	Token     string `json:"token"`
}

// Endpoint for sending a prompt on a temporary chat
// The temporary chat should already exist
func (i *Injection) PostPromptTempChat(w http.ResponseWriter, r *http.Request) {

}
