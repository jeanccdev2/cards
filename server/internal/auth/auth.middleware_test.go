package auth

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func TestAuthMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("rejects missing authorization header", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		r := gin.New()
		r.GET("/me", AuthMiddleware(), func(c *gin.Context) { c.Status(http.StatusOK) })

		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/me", nil)
		r.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected status %d, got %d", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("rejects invalid header format", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		r := gin.New()
		r.GET("/me", AuthMiddleware(), func(c *gin.Context) { c.Status(http.StatusOK) })

		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/me", nil)
		req.Header.Set("Authorization", "BadFormat")
		r.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected status %d, got %d", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("rejects invalid token", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		r := gin.New()
		r.GET("/me", AuthMiddleware(), func(c *gin.Context) { c.Status(http.StatusOK) })

		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/me", nil)
		req.Header.Set("Authorization", "Bearer invalid")
		r.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected status %d, got %d", http.StatusUnauthorized, w.Code)
		}
	})

	t.Run("accepts valid token and sets userID", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		claims := jwt.MapClaims{
			"sub": "user-123",
			"exp": time.Now().Add(time.Hour).Unix(),
		}
		tokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("secret"))
		if err != nil {
			t.Fatalf("failed to sign token: %v", err)
		}

		r := gin.New()
		r.GET("/me", AuthMiddleware(), func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"userID": c.GetString("userID")})
		})

		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/me", nil)
		req.Header.Set("Authorization", "Bearer "+tokenString)
		r.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status %d, got %d", http.StatusOK, w.Code)
		}

		var body struct {
			UserID string `json:"userID"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
			t.Fatalf("failed to decode json: %v", err)
		}
		if body.UserID != "user-123" {
			t.Fatalf("expected userID %q, got %q", "user-123", body.UserID)
		}
	})
}

