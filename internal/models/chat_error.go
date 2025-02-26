package models

import "encoding/json"

type ChatError struct {
	Error string `json:"error"`
}

func NewChatError(err error) ChatError {
	return ChatError{Error: err.Error()}
}

func (e ChatError) ToJson() []byte {
	json, _ := json.Marshal(e)
	return json
}
