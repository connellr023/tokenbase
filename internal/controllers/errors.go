package controllers

import "errors"

var (
	ErrBearerTokenNotFound = errors.New("bearer token not found")
	ErrBadData             = errors.New("bad data")
)
