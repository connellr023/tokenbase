package cache

import "time"

const (
	dummySortedSetMember   = "__placeholder__"
	globalChatIdCounterKey = "global_chat_id_counter"
	cacheSessionExpiry     = 20 * time.Minute
)
