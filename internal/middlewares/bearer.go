package middlewares

import (
	"context"
	"net/http"
	"strings"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"

	"github.com/go-chi/chi/v5"
)

type BearerToken string
type bearerContextKey string

const bearerKey bearerContextKey = "bearer"

func bearerExtractorMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			// No token provided, continue.
			next.ServeHTTP(w, r)
			return
		}

		// Expect: "Bearer <token>".
		parts := strings.Split(authHeader, " ")

		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, utils.ErrInvalidAuthHeader.Error(), http.StatusUnauthorized)
			return
		}

		// Extract token and create context.
		token := parts[1]
		ctx := context.WithValue(r.Context(), bearerKey, token)

		// Call next middleware.
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetBearerFromContext(ctx context.Context) (string, bool) {
	bearer, ok := ctx.Value(bearerKey).(string)
	return bearer, ok
}

func GetUserFromJwt(ctx context.Context) (models.ClientUser, error) {
	bearer, ok := GetBearerFromContext(ctx)

	if !ok {
		return models.ClientUser{}, utils.ErrInvalidBearerToken
	}

	user, err := utils.ValidateJwt(bearer)

	if err != nil {
		return models.ClientUser{}, err
	}

	return user, nil
}

func UseBearerExtractorMiddleware(router chi.Router) {
	router.Use(bearerExtractorMiddleware)
}
