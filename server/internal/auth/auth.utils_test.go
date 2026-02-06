package auth

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestValidateJWTToken(t *testing.T) {
	t.Run("errors when JWT_SECRET is not set", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "")

		_, err := ValidateJWTToken("token")
		if err == nil {
			t.Fatalf("expected error")
		}
	})

	t.Run("errors on invalid token", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		_, err := ValidateJWTToken("not-a-jwt")
		if err == nil {
			t.Fatalf("expected error")
		}
	})

	t.Run("errors on unexpected signing method", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		claims := jwt.MapClaims{
			"sub": "user-1",
			"exp": time.Now().Add(time.Hour).Unix(),
		}
		tokenString, err := jwt.NewWithClaims(jwt.SigningMethodNone, claims).SignedString(jwt.UnsafeAllowNoneSignatureType)
		if err != nil {
			t.Fatalf("failed to sign token: %v", err)
		}

		_, err = ValidateJWTToken(tokenString)
		if err == nil {
			t.Fatalf("expected error")
		}
	})

	t.Run("returns token when valid", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")

		claims := jwt.MapClaims{
			"sub": "user-1",
			"exp": time.Now().Add(time.Hour).Unix(),
		}
		tokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("secret"))
		if err != nil {
			t.Fatalf("failed to sign token: %v", err)
		}

		token, err := ValidateJWTToken(tokenString)
		if err != nil {
			t.Fatalf("expected nil error, got %v", err)
		}
		if token == nil || !token.Valid {
			t.Fatalf("expected valid token")
		}
	})
}
