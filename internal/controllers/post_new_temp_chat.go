package controllers

import "net/http"

type postNewTempChatResponse struct {
	ChatID string `json:"chat_id"`
}

// Endpoint requesting a new temporary chat be created
// Temporary chats will only live in Redis
func (i *Injection) PostNewTempChat(w http.ResponseWriter, r *http.Request) {

}
