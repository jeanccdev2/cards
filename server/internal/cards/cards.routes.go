package cards

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterCardsRoutes(appGroup *gin.RouterGroup, db *gorm.DB) {
	service := NewCardsService(db)
	handler := NewCardsHandler(service)

	cardsGroup := appGroup.Group("/cards")
	cardsGroup.GET("/list", handler.List)
}
