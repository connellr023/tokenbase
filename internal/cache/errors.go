package cache

import "errors"

var (
	ErrGuestSessionNotFound = errors.New("guest session does not exist or has expired")
)
