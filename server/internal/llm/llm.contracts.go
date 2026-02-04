package llm

import "context"

type Role string

const (
	RoleUser      Role = "user"
	RoleAssistant Role = "assistant"
	RoleSystem    Role = "system"
)

type Message struct {
	Role    Role
	Content string
}

type LLMService interface {
	GenerateMultipleCards(ctx context.Context, messages []Message) (*CardsResponse, error)
}

type CardsResponse struct {
	Cards []Card `json:"cards"`
}

type Card struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}
