package cache

func FmtUserSessionKey(userId string) string {
	return "user_session:" + userId
}
