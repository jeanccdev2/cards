package auth

import (
	"cards/internal/types"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "", nil, "Authorization header required"))
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "", nil, "Invalid authorization header format"))
			return
		}

		tokenString := parts[1]
		token, err := ValidateJWTToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "Invalid or expired token", nil, err))
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "", nil, "Invalid token claims"))
			return
		}

		sub, ok := claims["sub"]
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "", nil, "Missing subject claim"))
			return
		}

		userID, ok := sub.(string)
		if !ok || userID == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, types.NewApiResponse(http.StatusUnauthorized, "", nil, "Invalid subject claim"))
			return
		}

		c.Set("userID", userID)
		c.Set("email", claims["email"])
		c.Set("role", claims["role"])

		c.Next()
	}
}
