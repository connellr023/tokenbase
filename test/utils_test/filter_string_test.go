package utils_test

import (
	"testing"
	"tokenbase/internal/utils"
)

func TestFilterStringFiltersCorrectly(t *testing.T) {
	original := "abcabcabc"
	expected := "bcbcbc"

	result := utils.FilterString(original, func(r rune) bool {
		return r != 'a'
	})

	if result != expected {
		t.Errorf("expected %q, got %q", expected, result)
	}
}
