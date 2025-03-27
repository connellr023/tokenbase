package cache

// Format a conversation ID into a redis key
//
// Parameters:
// - conversationID: The ID of the conversation
//
// Returns:
// - The formatted key
func FmtConversationKey(conversationID string) string {
	return "conversation:" + conversationID
}
