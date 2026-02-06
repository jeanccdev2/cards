package cards

import (
	"cards/internal/types"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CardsHandler interface {
	List(c *gin.Context)
	GetByID(c *gin.Context)
	Create(c *gin.Context)
	CreateMultiple(c *gin.Context)
	GenerateMultipleCards(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

type cardsHandler struct {
	Service CardsService
}

func NewCardsHandler(service CardsService) CardsHandler {
	return &cardsHandler{Service: service}
}

func (h *cardsHandler) List(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "User ID is required", nil, "User ID is empty"))
		return
	}

	cards, err := h.Service.List(uuid.MustParse(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(http.StatusInternalServerError, "Failed to list cards", nil, err.Error()))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusOK, "Cards listed successfully", cards, nil))
}

func (h *cardsHandler) GetByID(c *gin.Context) {
	cardID := c.Param("cardID")
	if cardID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "Card ID is required", nil, "Card ID is empty"))
		return
	}

	card, err := h.Service.GetByID(uuid.MustParse(cardID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(http.StatusInternalServerError, "Failed to get card", nil, err.Error()))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusOK, "Card retrieved successfully", card, nil))
}

func (h *cardsHandler) Create(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "User ID is required", nil, "User ID is empty"))
		return
	}

	var dto CreateCardDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "Invalid request payload", nil, err.Error()))
		return
	}

	card, err := h.Service.Create(uuid.MustParse(userID), dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(
			http.StatusInternalServerError,
			"Failed to create card",
			nil,
			err.Error(),
		))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusCreated, "Card created successfully", card, nil))
}

func (h *cardsHandler) CreateMultiple(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "User ID is required", nil, "User ID is empty"))
		return
	}

	var dto []CreateCardDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(http.StatusBadRequest, "Invalid request payload", nil, err.Error()))
		return
	}

	cards, err := h.Service.CreateMultiple(uuid.MustParse(userID), dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(http.StatusInternalServerError, "Failed to create cards", nil, err.Error()))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusCreated, "Cards created successfully", cards, nil))
}

func (h *cardsHandler) GenerateMultipleCards(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"User ID is required",
			nil,
			"User ID is empty",
		))
		return
	}

	var dto GenerateMultipleCardsDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"Invalid request payload",
			nil,
			err.Error(),
		))
		return
	}

	cards, err := h.Service.GenerateMultipleCards(
		uuid.MustParse(userID),
		dto.UserPrompt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(
			http.StatusInternalServerError,
			"Failed to generate cards",
			nil,
			err.Error(),
		))
		return
	}

	c.JSON(http.StatusCreated, types.NewApiResponse(
		http.StatusCreated,
		"Cards generated successfully",
		cards,
		nil,
	))
}

func (h *cardsHandler) Update(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"User ID is required",
			nil,
			"User ID is empty",
		))
		return
	}

	var dto UpdateCardDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"Invalid request payload",
			nil,
			err.Error(),
		))
		return
	}

	cardID := c.Param("cardID")
	if cardID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"Card ID is required",
			nil,
			"Card ID is empty",
		))
		return
	}

	card, err := h.Service.Update(
		uuid.MustParse(userID),
		uuid.MustParse(cardID),
		dto,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(
			http.StatusInternalServerError,
			"Failed to update card",
			nil,
			err.Error(),
		))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(
		http.StatusOK,
		"Card updated successfully",
		card,
		nil,
	))
}

func (h *cardsHandler) Delete(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"User ID is required",
			nil,
			"User ID is empty",
		))
		return
	}

	cardID := c.Param("cardID")
	if cardID == "" {
		c.JSON(http.StatusBadRequest, types.NewApiResponse(
			http.StatusBadRequest,
			"Card ID is required",
			nil,
			"Card ID is empty",
		))
		return
	}

	card, err := h.Service.Delete(
		uuid.MustParse(userID),
		uuid.MustParse(cardID),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(
			http.StatusInternalServerError,
			"Failed to update card",
			nil,
			err.Error(),
		))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(
		http.StatusOK,
		"Card updated successfully",
		card,
		nil,
	))
}
