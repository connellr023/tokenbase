package models

import "encoding/json"

type ChatError struct {
	Error string `json:"error"`
}

// Creates a new ChatError from an error
//
// Parameters:
// - err: The error to convert to a ChatError
//
// Returns:
// - A new ChatError
func NewChatError(err error) ChatError {
	return ChatError{Error: err.Error()}
}

// Converts the error to a JSON byte array
//
// Returns:
// - A JSON byte array representing the error
func (e ChatError) ToJson() []byte {
	json, _ := json.Marshal(e)
	return json
}
