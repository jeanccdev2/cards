package auth

import (
	"cards/internal/models"
	"log"

	"gorm.io/gorm"
)

type AuthRepository interface {
	FindUserByEmail(email string) (*models.User, error)
	SaveUser(user *models.User) error
	FindUserByID(id string) (*models.User, error)
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) FindUserByEmail(email string) (*models.User, error) {
	var user models.User
	log.Printf("Finding user by email: %s", email)
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		log.Printf("Error finding user by email %s: %v", email, err)
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) FindUserByID(id string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) SaveUser(user *models.User) error {
	return r.db.Save(user).Error
}
