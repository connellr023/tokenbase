package models

type ChatToken struct {
	CreatedAt int64  `json:"createdAt,omitempty"`
	Token     string `json:"token"` // The token created by the LLM
}
