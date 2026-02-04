package cards

import (
	"cards/internal/types"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CardsHandler interface {
	List(c *gin.Context)
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

	cards, err := h.Service.List(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.NewApiResponse(http.StatusInternalServerError, "Failed to list cards", nil, err.Error()))
		return
	}

	c.JSON(http.StatusOK, types.NewApiResponse(http.StatusOK, "Cards listed successfully", cards, nil))
}
