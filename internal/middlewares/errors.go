package middlewares

import "errors"

var (
	ErrInvalidAuthHeader  = errors.New("authorization header format must be 'Bearer <token>'")
	ErrInvalidBearerToken = errors.New("invalid bearer token")
)
