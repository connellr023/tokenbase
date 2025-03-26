package db

import "errors"

var (
	ErrNoResults     = errors.New("no results found")
	ErrQueryFailed   = errors.New("query failed")
	ErrUsernameTaken = errors.New("username already taken")
	ErrEmailUsed     = errors.New("email already used")
)
