package controllers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"tokenbase/internal/controllers"
)

func TestGetChatSuggestionsGetsCorrectly(t *testing.T) {
	injection := &controllers.Injection{}

	req, err := http.NewRequest("GET", "/chate-suggestions", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	rr := httptest.NewRecorder()

	handler := http.HandlerFunc(injection.GetChatSuggestions)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned incorrect status code: got %v want %v", status, http.StatusOK)
	}

	var suggestions []string
	if err := json.Unmarshal(rr.Body.Bytes(), &suggestions); err != nil {
		t.Fatalf("Failed to deserialize response body: %v", err)
	}

	if len(suggestions) < 3 {
		t.Errorf("3 or more sugestions expected, got %d", len(suggestions))
	}

	suggestionSet := make(map[string]bool)
	for _, suggestion := range suggestions {
		if suggestionSet[suggestion] {
			t.Errorf("Duplicate suggestion found: %s", suggestion)
		}
		suggestionSet[suggestion] = true
	}
}
