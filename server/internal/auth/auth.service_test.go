package auth

import (
	"errors"
	"testing"
	"time"

	"cards/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type fakeAuthRepository struct {
	findByEmail func(email string) (*models.User, error)
	saveUser    func(user *models.User) error
	findByID    func(id string) (*models.User, error)

	savedUser *models.User
}

func (r *fakeAuthRepository) FindUserByEmail(email string) (*models.User, error) {
	if r.findByEmail != nil {
		return r.findByEmail(email)
	}
	return nil, errors.New("not implemented")
}

func (r *fakeAuthRepository) SaveUser(user *models.User) error {
	r.savedUser = user
	if r.saveUser != nil {
		return r.saveUser(user)
	}
	return nil
}

func (r *fakeAuthRepository) FindUserByID(id string) (*models.User, error) {
	if r.findByID != nil {
		return r.findByID(id)
	}
	return nil, errors.New("not implemented")
}

func TestAuthService_Register(t *testing.T) {
	t.Run("returns error when email already exists", func(t *testing.T) {
		repo := &fakeAuthRepository{
			findByEmail: func(email string) (*models.User, error) {
				return &models.User{Email: email}, nil
			},
			saveUser: func(user *models.User) error {
				t.Fatalf("did not expect SaveUser call")
				return nil
			},
		}
		svc := NewAuthService(repo)

		_, err := svc.Register(RegisterRequestDTO{Name: "A", Email: "a@example.com", Password: "pw"})
		if err == nil || err.Error() != "email already registered" {
			t.Fatalf("expected email already registered error, got %v", err)
		}
	})

	t.Run("saves user when email not found", func(t *testing.T) {
		repo := &fakeAuthRepository{
			findByEmail: func(email string) (*models.User, error) {
				return nil, errors.New("not found")
			},
		}
		svc := NewAuthService(repo)

		user, err := svc.Register(RegisterRequestDTO{Name: "A", Email: "a@example.com", Password: "pw"})
		if err != nil {
			t.Fatalf("expected nil error, got %v", err)
		}
		if user == nil {
			t.Fatalf("expected user")
		}
		if repo.savedUser == nil {
			t.Fatalf("expected SaveUser called")
		}
		if repo.savedUser.Email != "a@example.com" || repo.savedUser.Name != "A" || repo.savedUser.Password != "pw" {
			t.Fatalf("unexpected saved user: %+v", repo.savedUser)
		}
	})
}

func TestAuthService_Login(t *testing.T) {
	t.Run("returns user not found when repository errors", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")
		repo := &fakeAuthRepository{
			findByEmail: func(email string) (*models.User, error) {
				return nil, errors.New("db error")
			},
		}
		svc := NewAuthService(repo)

		_, err := svc.Login("a@example.com", "pw")
		if err == nil || err.Error() != "user not found" {
			t.Fatalf("expected user not found error, got %v", err)
		}
	})

	t.Run("returns invalid credentials for bad password", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")
		hash, err := bcrypt.GenerateFromPassword([]byte("pw"), bcrypt.DefaultCost)
		if err != nil {
			t.Fatalf("failed to hash password: %v", err)
		}

		repo := &fakeAuthRepository{
			findByEmail: func(email string) (*models.User, error) {
				return &models.User{Email: email, Password: string(hash)}, nil
			},
		}
		svc := NewAuthService(repo)

		_, err = svc.Login("a@example.com", "wrong")
		if err == nil || err.Error() != "invalid credentials" {
			t.Fatalf("expected invalid credentials error, got %v", err)
		}
	})

	t.Run("returns signed token and user DTO", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "secret")
		hash, err := bcrypt.GenerateFromPassword([]byte("pw"), bcrypt.DefaultCost)
		if err != nil {
			t.Fatalf("failed to hash password: %v", err)
		}
		id := uuid.New()
		createdAt := time.Date(2026, 2, 5, 10, 11, 12, 0, time.UTC)
		user := &models.User{Base: models.Base{ID: id, CreatedAt: createdAt}, Name: "A", Email: "a@example.com", Password: string(hash)}

		repo := &fakeAuthRepository{
			findByEmail: func(email string) (*models.User, error) {
				return user, nil
			},
		}
		svc := NewAuthService(repo)

		res, err := svc.Login("a@example.com", "pw")
		if err != nil {
			t.Fatalf("expected nil error, got %v", err)
		}
		if res == nil || res.Token == "" || res.User == nil {
			t.Fatalf("expected token and user")
		}
		if res.User.ID != id.String() || res.User.Email != "a@example.com" || res.User.Name != "A" {
			t.Fatalf("unexpected user dto: %+v", res.User)
		}
		if res.User.CreatedAt != createdAt.Format(time.RFC3339) {
			t.Fatalf("expected created_at %q, got %q", createdAt.Format(time.RFC3339), res.User.CreatedAt)
		}

		parsed, err := jwt.Parse(res.Token, func(token *jwt.Token) (interface{}, error) {
			return []byte("secret"), nil
		})
		if err != nil {
			t.Fatalf("failed to parse token: %v", err)
		}
		claims, ok := parsed.Claims.(jwt.MapClaims)
		if !ok {
			t.Fatalf("expected map claims")
		}
		if claims["sub"] != id.String() {
			t.Fatalf("expected sub %q, got %v", id.String(), claims["sub"])
		}
		if claims["exp"] == nil {
			t.Fatalf("expected exp")
		}
	})
}

func TestAuthService_GetUser(t *testing.T) {
	user := &models.User{Name: "A"}
	repo := &fakeAuthRepository{
		findByID: func(id string) (*models.User, error) {
			if id != "123" {
				return nil, errors.New("unexpected id")
			}
			return user, nil
		},
	}
	svc := NewAuthService(repo)

	got, err := svc.GetUser("123")
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if got != user {
		t.Fatalf("expected same user pointer")
	}
}

