package auth

import "cards/internal/models"

type RegisterRequestDTO struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Document string `json:"document" binding:"required"`
}

type LoginRequestDTO struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponseDTO struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

type ForgotPasswordRequestDTO struct {
	Email string `json:"email" binding:"required"`
}
