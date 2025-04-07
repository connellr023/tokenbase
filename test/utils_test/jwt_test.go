package utils_test

import (
	"reflect"
	"testing"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

func TestJwtGenerateAndValidate(t *testing.T) {
	user := models.ClientUser{
		ID:        "ksdijfiklods",
		Username:  "testuser",
		Email:     "test@test.test",
		IsAdmin:   false,
		CreatedAt: 45839059403,
	}

	token, err := utils.GenerateJwt(user)

	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}

	jwtUser, err := utils.ValidateJwt(token)

	if err != nil {
		t.Fatalf("Failed to validate JWT: %v", err)
	}

	if !reflect.DeepEqual(jwtUser, user) {
		t.Fatalf("Expected %v, got %v", user, jwtUser)
	}
}
