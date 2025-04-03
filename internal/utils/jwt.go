package utils

import (
	"time"
	"tokenbase/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/mitchellh/mapstructure"
)

const (
	jwtLifetime  = time.Hour * 24
	jwtSecretKey = "supersecretkey" // Hardcoded for now.
)

// Generates a JWT for a user.
//
// Parameters:
// - user: User to generate a token for.
//
// Returns:
// - The generated JWT.
// - Any error that occurred.
func GenerateJwt(user models.ClientUser) (string, error) {
	claims := jwt.MapClaims{
		"user": user,
		"exp":  time.Now().Add(jwtLifetime).Unix(),
		"iat":  time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	key := []byte(jwtSecretKey)

	return token.SignedString(key)
}

// Validates a JWT.
//
// Parameters:
// - tokenStr: JWT to validate.
//
// Returns:
// - The user associated with the token.
// - Any error that occurred.
func ValidateJwt(tokenStr string) (models.ClientUser, error) {
	token, err := jwt.Parse(tokenStr, func(_ *jwt.Token) (any, error) {
		return []byte(jwtSecretKey), nil
	})

	if err != nil {
		return models.ClientUser{}, err
	}

	// Decode claims.
	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok || !token.Valid {
		return models.ClientUser{}, ErrInvalidJwt
	}

	// Convert the user map back to user struct.
	var user models.ClientUser

	if err = mapstructure.Decode(claims["user"], &user); err != nil {
		return models.ClientUser{}, err
	}

	return user, nil
}
