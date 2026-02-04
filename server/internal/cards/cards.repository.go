package cards

import (
	"cards/internal/models"

	"gorm.io/gorm"
)

type CardsRepository interface {
	ListByUserID(string) ([]models.Card, error)
}

type cardsRepository struct {
	db *gorm.DB
}

func NewCardsRepository(db *gorm.DB) CardsRepository {
	return &cardsRepository{db: db}
}

func (r *cardsRepository) ListByUserID(userID string) ([]models.Card, error) {
	var cards []models.Card
	if err := r.db.Where("user_id = ?", userID).Find(&cards).Error; err != nil {
		return nil, err
	}
	return cards, nil
}
