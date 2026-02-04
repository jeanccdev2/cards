package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type openrouterService struct {
	httpClient *http.Client
	apiKey     string
}

func NewOpenRouterService() LLMService {
	return &openrouterService{
		httpClient: &http.Client{},
		apiKey:     os.Getenv("OPENROUTER_API_KEY"),
	}
}

type OpenRouterResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (s *openrouterService) Chat(
	ctx context.Context,
	messages []Message,
) (string, error) {

	payload, err := s.buildPayload(messages)
	if err != nil {
		return "", err
	}

	respBytes, err := s.doRequest(ctx, payload)
	if err != nil {
		return "", err
	}

	content, err := parseOpenRouterResponse(respBytes)
	if err != nil {
		return "", err
	}

	cardsResp, err := parseCardsResponse(content)
	if err != nil {
		return "", err
	}

	out, _ := json.Marshal(cardsResp)
	return string(out), nil
}

func (s *openrouterService) buildPayload(messages []Message) (map[string]interface{}, error) {
	if len(messages) == 0 {
		return nil, fmt.Errorf("no messages provided")
	}

	return map[string]interface{}{
		"model": "openai/gpt-4o-mini",
		"messages": []map[string]string{
			system("You are a helpful assistant that generates cards based on the user prompt."),
			system("Cards must be minimalistic and useful."),
			system("Do not include any unnecessary information or explanations."),
			system("Analyze if user wants to create multiple cards with same prompt, checking if prompt has different subjects."),
			system("If possible, just provide the title and content of the card exactly how the user requested."),
			{
				"role":    string(RoleUser),
				"content": messages[0].Content,
			},
		},
		"response_format": cardsResponseSchema(),
	}, nil
}

func system(content string) map[string]string {
	return map[string]string{
		"role":    string(RoleSystem),
		"content": content,
	}
}

func cardsResponseSchema() map[string]interface{} {
	return map[string]interface{}{
		"type": "json_schema",
		"json_schema": map[string]interface{}{
			"name": "cards_response",
			"schema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"cards": map[string]interface{}{
						"type":        "array",
						"description": "An array of cards generated using prompt and your intelligence",
						"items": map[string]interface{}{
							"type": "object",
							"properties": map[string]interface{}{
								"title": map[string]interface{}{
									"type": "string",
								},
								"content": map[string]interface{}{
									"type": "string",
								},
							},
							"required":             []string{"title", "content"},
							"additionalProperties": false,
						},
					},
				},
				"required":             []string{"cards"},
				"additionalProperties": false,
			},
		},
	}
}

func (s *openrouterService) doRequest(
	ctx context.Context,
	payload map[string]interface{},
) ([]byte, error) {

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(
		ctx,
		"POST",
		"https://openrouter.ai/api/v1/chat/completions",
		bytes.NewBuffer(body),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+s.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "https://seu-app.com")
	req.Header.Set("X-Title", "Seu App")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("openrouter error: %s", resp.Status)
	}

	return io.ReadAll(resp.Body)
}

func parseOpenRouterResponse(data []byte) (string, error) {
	var resp OpenRouterResponse
	if err := json.Unmarshal(data, &resp); err != nil {
		return "", err
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("empty choices from OpenRouter")
	}

	return resp.Choices[0].Message.Content, nil
}

func parseCardsResponse(content string) (*CardsResponse, error) {
	var cards CardsResponse
	if err := json.Unmarshal([]byte(content), &cards); err != nil {
		return nil, err
	}
	return &cards, nil
}
