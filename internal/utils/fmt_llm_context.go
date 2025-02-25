package utils

import (
	"strings"
	"tokenbase/internal/models"
)

const (
	systemPrompt = "You are an AI assistant. Answer concisely and accurately."
	separator    = "\n###\n"
	promptHeader = "\n[USER]:\n"
	replyHeader  = "\n[ASSISTANT]:\n"
)

// Constructs formatted conversation history
func FmtLlmContext(records []models.ChatRecord, newPrompt string) string {
	var builder strings.Builder

	// Add system prompt
	builder.WriteString(systemPrompt)
	builder.WriteString(separator)

	// Append formatted conversation history
	for _, record := range records {
		builder.WriteString(promptHeader)
		builder.WriteString(record.Prompt)
		builder.WriteString(replyHeader)
		builder.WriteString(record.Reply)
		builder.WriteString(separator)
	}

	// Append new user prompt
	builder.WriteString(promptHeader)
	builder.WriteString(newPrompt)
	builder.WriteString(replyHeader) // LLM should generate reply after this

	return builder.String()
}
