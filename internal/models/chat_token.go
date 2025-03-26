package models

type ChatToken struct {
	CacheChatID int64  `json:"chatId,omitempty"` // The Redis ID of the chat the token should be appended to
	Token       string `json:"token"`            // The token created by the LLM
}
