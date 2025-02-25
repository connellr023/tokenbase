package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
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
// - mapFunc: The function that processes the incoming data and returns the outgoing data
//
// Returns:
// - An error if the response could not be streamed
func MapHttpStream[U any, V any](w http.ResponseWriter, r io.Reader, mapFunc func(U) V) error {
	// Set headers for streaming response
	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Transfer-Encoding", "chunked")

	flusher, ok := w.(http.Flusher)

	if !ok {
		return errors.New("streaming is not supported")
	}

	// Begin decoding the response
	decoder := json.NewDecoder(r)

	for {
		var data U

		if err := decoder.Decode(&data); err != nil {
			break
		}

		// Stream the response to the client
		res := mapFunc(data)

		// Serialize response
		resJson, err := json.Marshal(res)

		if err != nil {
			return err
		}

		// Write response to client
		w.Write(resJson)
		w.Write([]byte("\n"))

		// Flush the buffer to ensure the chunk is sent
		flusher.Flush()
	}

	return nil
}
