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
}
