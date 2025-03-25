package utils

import (
	"errors"
	"time"
	"tokenbase/internal/models"

	"github.com/golang-jwt/jwt/v5"
)

const (
	jwtLifetime  = time.Hour * 24
	jwtSecretKey = "supersecretkey" // Hardcoded for now
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

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

func ValidateJwt(tokenStr string) (models.ClientUser, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}

		return []byte(jwtSecretKey), nil
	})

	if err != nil {
		return models.ClientUser{}, err
	}

	// Decode claims
	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok || !token.Valid {
		return models.ClientUser{}, ErrInvalidToken
	}

	// Extract user
	user, ok := claims["user"].(models.ClientUser)

	if !ok {
		return models.ClientUser{}, ErrInvalidToken
	}

	return user, nil
}
