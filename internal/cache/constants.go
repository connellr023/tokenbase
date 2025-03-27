package cache

import "time"

const (
	dummySortedSetMember  = "__placeholder__"
	globalSystemPromptKey = "global_system_prompt"
	cacheSessionExpiry    = 20 * time.Minute
)
