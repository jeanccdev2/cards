package llm

import (
	"context"
	"os"

	"google.golang.org/genai"
)

type geminiService struct {
	client *genai.Client
	model  string
}

func NewGeminiService(ctx context.Context) LLMService {
	client := getLLMClient(ctx)

	return &geminiService{
		client: client,
		model:  "gemini-2.0-flash",
	}
}

func getLLMClient(ctx context.Context) *genai.Client {
	apiKey := os.Getenv("GENAI_API_KEY")

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		panic(err)
	}

	return client
}

func (s *geminiService) GenerateMultipleCards(
	ctx context.Context,
	messages []Message,
) (*CardsResponse, error) {

	resp, err := s.client.Models.GenerateContent(
		ctx,
		s.model,
		toGenaiMessages(messages),
		&genai.GenerateContentConfig{
			ResponseSchema: &genai.Schema{
				Type: genai.TypeObject,
				Properties: map[string]*genai.Schema{
					"cards": {
						Type:        genai.TypeArray,
						Description: "An array of cards generated using prompt and your intelligence",
						Items: &genai.Schema{
							Type: genai.TypeObject,
							Properties: map[string]*genai.Schema{
								"title": {
									Type:        genai.TypeString,
									Description: "The title of the card",
								},
								"content": {
									Type:        genai.TypeString,
									Description: "The content of the card",
								},
							},
						},
					},
				},
			},
			SystemInstruction: &genai.Content{
				Role: string(RoleSystem),
				Parts: []*genai.Part{
					{
						Text: "You are a helpful assistant that generates cards based on the user prompt.",
					},
					{
						Text: "Cards must be minimalistic and useful.",
					},
					{
						Text: "Do not include any unnecessary information or explanations.",
					},
					{
						Text: "Analyze if user wants to create multiple cards with same prompt, checking if prompt has different subjects.",
					},
					{
						Text: "If possible, just provide the title and content of the card exactly how the user requested.",
					},
				},
			},
		},
	)
	if err != nil {
		return nil, err
	}

	if len(resp.Candidates) == 0 ||
		len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, nil
	}

	// return resp.Candidates[0].Content.Parts[0].Text, nil
	return nil, nil
}

func toGenaiMessages(messages []Message) []*genai.Content {
	ptrMessages := make([]*genai.Content, 0, len(messages))

	for _, m := range messages {
		ptrMessages = append(ptrMessages, &genai.Content{
			Role: string(m.Role),
			Parts: []*genai.Part{
				{
					Text: m.Content,
				},
			},
		})
	}

	return ptrMessages
}
