package controllers

import "errors"

var (
	ErrBearerTokenNotFound = errors.New("bearer token not found")
	ErrInvalidID           = errors.New("invalid ID")
)
