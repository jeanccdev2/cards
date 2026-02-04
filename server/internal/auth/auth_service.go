package auth

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"cards/internal/models"
)

type AuthService interface {
	Register(input RegisterRequestDTO) (*models.User, error)
	Login(email, password string) (*LoginResponseDTO, error)
	ValidateToken(tokenString string) (*jwt.Token, error)
	GetUser(id string) (*models.User, error)
}

type authService struct {
	DB        *gorm.DB
	jwtSecret []byte
}

func NewAuthService(db *gorm.DB) AuthService {
	secret := os.Getenv("JWT_SECRET")
	return &authService{DB: db, jwtSecret: []byte(secret)}
}

func (s *authService) Register(input RegisterRequestDTO) (*models.User, error) {
	var existing models.User
	if err := s.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		return nil, errors.New("email already registered")
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
	}
	if err := s.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *authService) Login(email, password string) (*LoginResponseDTO, error) {
	var user models.User
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	claims := jwt.MapClaims{
		"sub": user.ID.String(),
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return nil, err
	}

	return &LoginResponseDTO{Token: signed, User: &user}, nil
}

func (s *authService) ValidateToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func (s *authService) GetUser(id string) (*models.User, error) {
	var user models.User
	if err := s.DB.Preload("Seller").Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
