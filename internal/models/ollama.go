package models

type OllamaChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
	Images  string `json:"images,omitempty"`
}

type OllamaChatRequest struct {
	Model     string              `json:"model"`
	KeepAlive int                 `json:"keep_alive"`
	Messages  []OllamaChatMessage `json:"messages"`
	Stream    bool                `json:"stream"`
}

type OllamaChatResponse struct {
	Model     string            `json:"model"`
	CreatedAt string            `json:"created_at"`
	Message   OllamaChatMessage `json:"message"`
	IsDone    bool              `json:"done"`
}
