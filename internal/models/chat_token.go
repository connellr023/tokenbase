package models

type ChatToken struct {
	ChatId int    `json:"chatId,omitempty"` // The ID of the chat the token should be appended to
	Token  string `json:"token"`            // The token created by the LLM
}
