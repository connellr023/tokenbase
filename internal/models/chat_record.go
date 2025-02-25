package models

// Represents a single back-and-forth chat record
// Will be used to represent a chat record in both Redis and SurrealDB
type ChatRecord struct {
	ChatId int    `json:"chatId"`
	Prompt string `json:"prompt"`
	Reply  string `json:"reply"`
}
