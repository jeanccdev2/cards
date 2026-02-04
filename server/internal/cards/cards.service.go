package cards

import (
	"gorm.io/gorm"

	"cards/internal/models"
)

type CardsService interface {
	List(userID string) ([]models.Card, error)
}

type cardsService struct {
	DB *gorm.DB
}

func NewCardsService(db *gorm.DB) CardsService {
	return &cardsService{DB: db}
}

func (s *cardsService) List(userID string) ([]models.Card, error) {
	var cards []models.Card
	if err := s.DB.Where("user_id = ?", userID).Find(&cards).Error; err != nil {
		return nil, err
	}
	return cards, nil
}
