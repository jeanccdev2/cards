package cards

import (
	"gorm.io/gorm"

	"cards/internal/models"
)

type CardsService interface {
	List(userID string) ([]models.Card, error)
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
