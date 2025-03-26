package utils

import (
	"net/http"
	"tokenbase/internal/models"
)

// Utility function to write a stream error as a JSON string to the response writer
//
// Parameters:
// w - The response writer
// err - The error to write
func WriteStreamError(w http.ResponseWriter, err error) {
	json := models.NewStreamError(err).ToJson()

	w.Write(json)
	w.Write([]byte("\n"))
}
