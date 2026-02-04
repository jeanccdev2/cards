package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"cards/internal/models"
)

type AuthService interface {
	Register(input RegisterRequestDTO) (*models.User, error)
	Login(email, password string) (*LoginResponseDTO, error)
	GetUser(id string) (*models.User, error)
}

type authService struct {
	repository AuthRepository
	jwtSecret  []byte
}

func NewAuthService(repository AuthRepository) AuthService {
	secret := os.Getenv("JWT_SECRET")
	return &authService{repository: repository, jwtSecret: []byte(secret)}
}

func (s *authService) Register(input RegisterRequestDTO) (*models.User, error) {
	_, err := s.repository.FindUserByEmail(input.Email)
	if err == nil {
		return nil, errors.New("email already registered")
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
	}
	if err := s.repository.SaveUser(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *authService) Login(email, password string) (*LoginResponseDTO, error) {
	user, err := s.repository.FindUserByEmail(email)
	if err != nil {
		return nil, errors.New("user not found")
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

	return &LoginResponseDTO{Token: signed, User: &UserResponseDTO{
		ID:        user.ID.String(),
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
	}}, nil
}

func (s *authService) GetUser(id string) (*models.User, error) {
	user, err := s.repository.FindUserByID(id)
	if err != nil {
		return nil, err
	}

	return user, nil
}
