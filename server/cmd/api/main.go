package main

import (
	"cards/internal/auth"
	"cards/internal/cards"
	"cards/internal/database"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("No .env file found")
	}

	// Initialize Database
	database.Connect()
	// Auto Migrate
	err := database.AutoMigrate()
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}
	db := database.GetDB()

	// Initialize Gin
	app := gin.Default()

	// CORS Configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true // Update this for production!
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	app.Use(cors.New(config))
	appGroupV1 := app.Group("/api/v1")
	cards.RegisterCardsRoutes(appGroupV1, db)
	auth.RegisterAuthRoutes(appGroupV1, db)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Printf("Server starting on port %s", port)
	if err := app.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
