package cache

import "errors"

var (
	ErrCacheMiss              = errors.New("cache miss")
	ErrFailedToRefreshExpiry  = errors.New("failed to refresh expiry for guest session")
	ErrFailedToSaveChatRecord = errors.New("failed to save chat record")
	ErrChatRecordNotFound     = errors.New("chat record not found")
	ErrConversationExists     = errors.New("conversation already exists")
)
