package cards

import (
	"context"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"cards/internal/llm"
	"cards/internal/models"
)

type CardsService interface {
	List(userID string) ([]models.Card, error)
	Create(userID uuid.UUID, dto CreateCardDTO) (models.Card, error)
	GenerateMultipleCards(userID uuid.UUID, userPrompt string) ([]SimpleCardResponseDTO, error)
}

type cardsService struct {
	DB         *gorm.DB
	Repository CardsRepository
}

func NewCardsService(repository CardsRepository) CardsService {
	return &cardsService{Repository: repository}
}

func (s *cardsService) List(userID string) ([]models.Card, error) {
	cards, err := s.Repository.ListByUserID(userID)
	if err != nil {
		return nil, err
	}

	return cards, nil
}

func (s *cardsService) Create(userID uuid.UUID, dto CreateCardDTO) (models.Card, error) {
	log.Printf("Creating card for user %s with title %s", userID, dto.Title)
	card := models.Card{
		Title:   dto.Title,
		Content: dto.Content,
		Status:  string(CardStatusUndone),
		UserID:  userID,
	}

	if err := s.Repository.Create(&card); err != nil {
		return models.Card{}, err
	}

	return card, nil
}

func (s *cardsService) GenerateMultipleCards(userID uuid.UUID, userPrompt string) ([]SimpleCardResponseDTO, error) {
	llmService := llm.NewOpenRouterService()
	ctx := context.Background()
	cardsResp, err := llmService.GenerateMultipleCards(ctx, []llm.Message{
		{
			Role:    llm.RoleUser,
			Content: userPrompt,
		},
	})

	if err != nil {
		return nil, err
	}

	var simpleCards []SimpleCardResponseDTO
	for _, card := range cardsResp.Cards {
		simpleCards = append(simpleCards, SimpleCardResponseDTO{
			Title:   card.Title,
			Content: card.Content,
		})
	}

	return simpleCards, nil
}
