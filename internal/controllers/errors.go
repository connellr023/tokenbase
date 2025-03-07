package controllers

import "errors"

var (
	ErrBearerTokenNotFound = errors.New("bearer token not found")
)
