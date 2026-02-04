package auth

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterAuthRoutes(appGroup *gin.RouterGroup, db *gorm.DB) {
	service := NewAuthService(db)
	handler := NewAuthHandler(service)

	authGroup := appGroup.Group("/auth")
	authGroup.POST("/register", handler.Register)
	authGroup.POST("/login", handler.Login)
	authGroup.GET("/me", AuthMiddleware(service), handler.Me)
}
