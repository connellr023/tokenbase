package db

import "errors"

var (
	ErrNoResults   = errors.New("no results found")
	ErrQueryFailed = errors.New("query failed")
)
