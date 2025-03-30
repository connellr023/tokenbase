package utils

import "errors"

var (
	ErrInvalidAuthHeader      = errors.New("authorization header format must be 'Bearer <token>'")
	ErrInvalidBearerToken     = errors.New("invalid bearer token")
	ErrFailedToRefreshExpiry  = errors.New("failed to refresh expiry for guest session")
	ErrFailedToSaveChatRecord = errors.New("failed to save chat record")
	ErrChatRecordNotFound     = errors.New("chat record not found")
	ErrKeyNotFound            = errors.New("key not found")
	ErrConversationExists     = errors.New("conversation already exists")
	ErrStreamAborted          = errors.New("stream was aborted")
	ErrBearerTokenNotFound    = errors.New("bearer token not found")
	ErrBadData                = errors.New("bad data")
	ErrNoResults              = errors.New("no results found")
	ErrTooManyResults         = errors.New("too many results found")
	ErrQueryFailed            = errors.New("query failed")
	ErrInvalidJwt             = errors.New("invalid JWT")
	ErrForbidden              = errors.New("insufficient privileges")
)
