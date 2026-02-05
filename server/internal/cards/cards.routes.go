package cards

import (
	"cards/internal/auth"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterCardsRoutes(appGroup *gin.RouterGroup, db *gorm.DB) {
	repository := NewCardsRepository(db)
	service := NewCardsService(repository)
	handler := NewCardsHandler(service)

	cardsGroup := appGroup.Group("/cards")
	cardsGroup.Use(auth.AuthMiddleware())
	cardsGroup.GET("/list", handler.List)
	cardsGroup.GET("/by_id/:cardID", handler.GetByID)
	cardsGroup.POST("/create", handler.Create)
	cardsGroup.POST("/generate_multiple_cards", handler.GenerateMultipleCards)
	cardsGroup.POST("/create_multiple_cards", handler.CreateMultiple)
	cardsGroup.PATCH("/update/:cardID", handler.Update)
}
