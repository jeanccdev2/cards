package cards

import (
	"cards/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CardsRepository interface {
	FindByID(uuid.UUID) (models.Card, error)
	ListByUserID(uuid.UUID) ([]models.Card, error)
	Create(*models.Card) error
	CreateMultiple([]models.Card) error
	Update(*models.Card) error
	Delete(uuid.UUID) error
}

type cardsRepository struct {
	db *gorm.DB
}

func NewCardsRepository(db *gorm.DB) CardsRepository {
	return &cardsRepository{db: db}
}

func (r *cardsRepository) FindByID(id uuid.UUID) (models.Card, error) {
	var card models.Card
	if err := r.db.Where("id = ?", id).First(&card).Error; err != nil {
		return models.Card{}, err
	}
	return card, nil
}

func (r *cardsRepository) ListByUserID(userID uuid.UUID) ([]models.Card, error) {
	var cards []models.Card
	if err := r.db.Where("user_id = ?", userID).Find(&cards).Error; err != nil {
		return nil, err
	}
	return cards, nil
}

func (r *cardsRepository) Create(card *models.Card) error {
	return r.db.Create(card).Error
}

func (r *cardsRepository) CreateMultiple(cards []models.Card) error {
	return r.db.Create(&cards).Error
}

func (r *cardsRepository) Update(card *models.Card) error {
	return r.db.Save(card).Error
}

func (r *cardsRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Card{
		Base: models.Base{
			ID: id,
		},
	}).Error
}
