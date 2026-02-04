package auth

import (
	"cards/internal/types"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Me(c *gin.Context)
}

type authHandler struct {
	Service AuthService
}

func NewAuthHandler(service AuthService) AuthHandler {
	return &authHandler{Service: service}
}

func (h *authHandler) Register(c *gin.Context) {
	var payload RegisterRequestDTO
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "Invalid request payload", nil, err.Error()))
		return
	}

	user, err := h.Service.Register(RegisterRequestDTO{
		Name:     payload.Name,
		Email:    payload.Email,
		Password: payload.Password,
		Document: payload.Document,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "Registration failed", nil, err.Error()))
		return
	}

	c.JSON(http.StatusCreated, types.NewApiResponse(http.StatusCreated, "User registered successfully", user, nil))
}

func (h *authHandler) Login(c *gin.Context) {
	var payload LoginRequestDTO
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "Invalid request payload", nil, err.Error()))
		return
	}
	res, err := h.Service.Login(payload.Email, payload.Password)
	if err != nil {
		status := http.StatusBadRequest
		if err.Error() == "invalid credentials" {
			status = http.StatusUnauthorized
		}
		c.JSON(status, types.NewApiResponse(status, "Login failed", nil, err.Error()))
		return
	}
	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusOK, "Login successful", res, nil))
}

func (h *authHandler) Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "Unauthorized access", nil, "Unauthorized"))
		return
	}

	user, err := h.Service.GetUser(fmt.Sprint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, types.NewApiResponse(http.StatusNotFound, "User not found", nil, "User not found"))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusOK, "User found", user, nil))
}
