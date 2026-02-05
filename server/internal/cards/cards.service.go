package cards

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"cards/internal/llm"
	"cards/internal/models"
)

type CardsService interface {
	List(userID uuid.UUID) ([]models.Card, error)
	GetByID(cardID uuid.UUID) (models.Card, error)
	Create(userID uuid.UUID, dto CreateCardDTO) (models.Card, error)
	CreateMultiple(userID uuid.UUID, dto []CreateCardDTO) ([]models.Card, error)
	GenerateMultipleCards(userID uuid.UUID, userPrompt string) ([]SimpleCardResponseDTO, error)
	Update(userID uuid.UUID, cardID uuid.UUID, dto UpdateCardDTO) (SimpleCardResponseDTO, error)
}

type cardsService struct {
	DB         *gorm.DB
	Repository CardsRepository
}

func NewCardsService(repository CardsRepository) CardsService {
	return &cardsService{Repository: repository}
}

func (s *cardsService) List(userID uuid.UUID) ([]models.Card, error) {
	cards, err := s.Repository.ListByUserID(userID)
	if err != nil {
		return nil, err
	}

	return cards, nil
}

func (s *cardsService) GetByID(cardID uuid.UUID) (models.Card, error) {
	card, err := s.Repository.FindByID(cardID)
	if err != nil {
		return models.Card{}, err
	}
	return card, nil
}

func (s *cardsService) Create(userID uuid.UUID, dto CreateCardDTO) (models.Card, error) {
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

func (s *cardsService) CreateMultiple(userID uuid.UUID, dto []CreateCardDTO) ([]models.Card, error) {
	var cards []models.Card
	for _, cardDTO := range dto {
		card := models.Card{
			Title:   cardDTO.Title,
			Content: cardDTO.Content,
			Status:  string(CardStatusUndone),
			UserID:  userID,
		}
		cards = append(cards, card)
	}

	if err := s.Repository.CreateMultiple(cards); err != nil {
		return nil, err
	}

	return cards, nil
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
			Status:  CardStatusUndone,
		})
	}

	return simpleCards, nil
}

func (s *cardsService) Update(userID uuid.UUID, cardID uuid.UUID, dto UpdateCardDTO) (SimpleCardResponseDTO, error) {
	card, err := s.Repository.FindByID(cardID)
	if err != nil {
		return SimpleCardResponseDTO{}, err
	}

	if card.UserID != userID {
		return SimpleCardResponseDTO{}, errors.New("unauthorized")
	}

	if dto.Title != nil {
		card.Title = *dto.Title
	}
	if dto.Content != nil {
		card.Content = *dto.Content
	}
	if dto.Status != nil {
		card.Status = string(*dto.Status)
	}

	if err := s.Repository.Update(&card); err != nil {
		return SimpleCardResponseDTO{}, err
	}

	return SimpleCardResponseDTO{
		Title:   card.Title,
		Content: card.Content,
		Status:  cardStatus(card.Status),
	}, nil
}
