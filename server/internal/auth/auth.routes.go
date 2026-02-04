package auth

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterAuthRoutes(appGroup *gin.RouterGroup, db *gorm.DB) {
	repository := NewAuthRepository(db)
	service := NewAuthService(repository)
	handler := NewAuthHandler(service)

	authGroup := appGroup.Group("/auth")
	authGroup.POST("/register", handler.Register)
	authGroup.POST("/login", handler.Login)
	authGroup.GET("/me", AuthMiddleware(), handler.Me)
}
