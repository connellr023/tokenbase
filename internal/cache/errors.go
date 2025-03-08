package cache

import "errors"

var (
	ErrSessionNotFound        = errors.New("session does not exist or has expired")
	ErrFailedToRefreshExpiry  = errors.New("failed to refresh expiry for guest session")
	ErrFailedToSaveChatRecord = errors.New("failed to save chat record")
	ErrChatRecordNotFound     = errors.New("chat record not found")
)
