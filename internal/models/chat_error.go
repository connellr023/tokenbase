package models

import "encoding/json"

type StreamError struct {
	Error string `json:"error"`
}

// Creates a new ChatError from an error.
//
// Parameters:
// - err: The error to convert to a ChatError.
//
// Returns:
// - A new ChatError.
func NewStreamError(err error) StreamError {
	return StreamError{Error: err.Error()}
}

// Converts the error to a JSON byte array.
//
// Returns:
// - A JSON byte array representing the error.
func (e StreamError) ToJSON() []byte {
	json, _ := json.Marshal(e)
	return json
}
