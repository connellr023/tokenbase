package models

type OllamaRole string

const (
	UserRole      = OllamaRole("user")
	AssistantRole = OllamaRole("assistant")
	SystemRole    = OllamaRole("system")
)

type OllamaChatMessage struct {
	Role    OllamaRole `json:"role"`
	Content string     `json:"content"`
	Images  []string   `json:"images,omitempty"`
}

type OllamaChatRequest struct {
	Model     string              `json:"model"`
	KeepAlive int                 `json:"keep_alive,omitempty"`
	Messages  []OllamaChatMessage `json:"messages"`
	Stream    bool                `json:"stream,omitempty"`
}

type OllamaChatResponse struct {
	Model     string            `json:"model"`
	CreatedAt string            `json:"created_at"`
	Message   OllamaChatMessage `json:"message"`
	IsDone    bool              `json:"done"`
}

type OllamaModelDetails struct {
	Format            string `json:"format"`
	Family            string `json:"family"`
	ParameterSize     string `json:"parameter_size"`
	QuantizationLevel string `json:"quantization_level"`
	Mmproj            bool   `json:"mmproj"`
}

type OllamaModel struct {
	Name       string `json:"name"`
	Model      string `json:"model"`
	ModifiedAt string `json:"modified_at"`
	Size       int    `json:"size"`
	Digest     string `json:"digest"`
}

type OllamaTagsResponse struct {
	Models []OllamaModel `json:"models"`
}
