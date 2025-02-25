package controllers

import "net/http"

type newGuestChatResponse struct {
	GuestSessionId string `json:"guestSessionId"`
}

// Endpoint requesting a new guest chat be created
// Guest chats will only live in Redis
func (i *Injection) PostNewGuestChat(w http.ResponseWriter, r *http.Request) {

}
