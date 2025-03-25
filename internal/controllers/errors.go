package controllers

import "errors"

var (
	ErrBearerTokenNotFound = errors.New("bearer token not found")
	ErrInvalidUserID       = errors.New("invalid user ID")
)
