package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"tokenbase/internal/models"
)

var (
	ErrStreamNotSupported = errors.New("streaming is not supported")
	ErrStreamAborted      = errors.New("stream was aborted")
)

// A utility function that uses a callback to process an incoming stream of data
// as it enters the server and returns a stream of data as it leaves the server.
//
// Type parameters:
// - U: The type of the incoming data
// - V: The type of the outgoing data
//
// Parameters:
// - w: The response writer
// - r: The request body reader
// - reqCtx: The context of the HTTP request
// - mapFunc: The function that processes the incoming data and returns the outgoing data
//
// Returns:
// - An error if the response could not be streamed
func MapHttpStream[U any, V any](w http.ResponseWriter, r io.Reader, reqCtx context.Context, mapFunc func(U) V) error {
	// Set headers for streaming response
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Transfer-Encoding", "chunked")

	flusher, ok := w.(http.Flusher)

	if !ok {
		return ErrStreamNotSupported
	}

	// Begin decoding the response
	decoder := json.NewDecoder(r)

	for {
		select {
		case <-reqCtx.Done():
			return ErrStreamAborted
		default:
			var data U

			if err := decoder.Decode(&data); err != nil {
				if err == io.EOF {
					// End of input stream
					return nil
				}
				return err
			}

			// Stream the response to the client
			res := mapFunc(data)

			// Serialize response
			resJson, err := json.Marshal(res)

			if err != nil {
				return err
			}

			// Write response to client
			_, err = w.Write(resJson)
			if err != nil {
				return err
			}
			_, err = w.Write([]byte("\n"))
			if err != nil {
				return err
			}

			// Flush the buffer to ensure the chunk is sent
			flusher.Flush()
		}
	}
}

// Utility function to write a stream error as a JSON string to the response writer
// It is expected that this function is always called in the context of an error and an HTTP stream
//
// Parameters:
// w - The response writer
// err - The error to write
func WriteStreamError(w http.ResponseWriter, err error) {
	json := models.NewStreamError(err).ToJson()

	// Ignore errors writing the error response as there is
	// nothing we can do since we are already in an error state
	_, _ = w.Write(json)
	_, _ = w.Write([]byte("\n"))
}
