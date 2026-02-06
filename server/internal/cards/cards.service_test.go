package cards

import (
	"errors"
	"testing"

	"cards/internal/models"

	"github.com/google/uuid"
)

type fakeCardsRepository struct {
	findByID     func(id uuid.UUID) (models.Card, error)
	listByUserID func(userID uuid.UUID) ([]models.Card, error)
	create       func(card *models.Card) error
	createMulti  func(cards []models.Card) error
	update       func(card *models.Card) error

	createdCard  *models.Card
	updatedCard  *models.Card
	createdMulti []models.Card
}

func (r *fakeCardsRepository) FindByID(id uuid.UUID) (models.Card, error) {
	if r.findByID != nil {
		return r.findByID(id)
	}
	return models.Card{}, errors.New("not implemented")
}

func (r *fakeCardsRepository) ListByUserID(userID uuid.UUID) ([]models.Card, error) {
	if r.listByUserID != nil {
		return r.listByUserID(userID)
	}
	return nil, errors.New("not implemented")
}

func (r *fakeCardsRepository) Create(card *models.Card) error {
	r.createdCard = card
	if r.create != nil {
		return r.create(card)
	}
	return nil
}

func (r *fakeCardsRepository) CreateMultiple(cards []models.Card) error {
	r.createdMulti = cards
	if r.createMulti != nil {
		return r.createMulti(cards)
	}
	return nil
}

func (r *fakeCardsRepository) Update(card *models.Card) error {
	r.updatedCard = card
	if r.update != nil {
		return r.update(card)
	}
	return nil
}

func TestCardsService_List(t *testing.T) {
	userID := uuid.New()
	expected := []models.Card{{Title: "t1"}, {Title: "t2"}}

	repo := &fakeCardsRepository{listByUserID: func(id uuid.UUID) ([]models.Card, error) {
		if id != userID {
			return nil, errors.New("unexpected user id")
		}
		return expected, nil
	}}
	svc := NewCardsService(repo)

	got, err := svc.List(userID)
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if len(got) != len(expected) {
		t.Fatalf("expected %d cards, got %d", len(expected), len(got))
	}
}

func TestCardsService_Create(t *testing.T) {
	userID := uuid.New()
	repo := &fakeCardsRepository{}
	svc := NewCardsService(repo)

	card, err := svc.Create(userID, CreateCardDTO{Title: "T", Content: "C"})
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if repo.createdCard == nil {
		t.Fatalf("expected Create called")
	}
	if repo.createdCard.UserID != userID {
		t.Fatalf("expected userID %s, got %s", userID, repo.createdCard.UserID)
	}
	if repo.createdCard.Status != string(CardStatusUndone) {
		t.Fatalf("expected status %q, got %q", string(CardStatusUndone), repo.createdCard.Status)
	}
	if card.Status != string(CardStatusUndone) {
		t.Fatalf("expected returned status %q, got %q", string(CardStatusUndone), card.Status)
	}
}

func TestCardsService_CreateMultiple(t *testing.T) {
	userID := uuid.New()
	repo := &fakeCardsRepository{}
	svc := NewCardsService(repo)

	cards, err := svc.CreateMultiple(userID, []CreateCardDTO{{Title: "T1", Content: "C1"}, {Title: "T2", Content: "C2"}})
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if len(repo.createdMulti) != 2 {
		t.Fatalf("expected CreateMultiple called with 2 cards, got %d", len(repo.createdMulti))
	}
	for i := range repo.createdMulti {
		if repo.createdMulti[i].UserID != userID {
			t.Fatalf("expected userID %s, got %s", userID, repo.createdMulti[i].UserID)
		}
		if repo.createdMulti[i].Status != string(CardStatusUndone) {
			t.Fatalf("expected status %q, got %q", string(CardStatusUndone), repo.createdMulti[i].Status)
		}
	}
	if len(cards) != 2 {
		t.Fatalf("expected 2 returned cards, got %d", len(cards))
	}
}

func TestCardsService_Update(t *testing.T) {
	userID := uuid.New()
	otherUserID := uuid.New()
	cardID := uuid.New()

	t.Run("returns unauthorized when card is owned by different user", func(t *testing.T) {
		repo := &fakeCardsRepository{findByID: func(id uuid.UUID) (models.Card, error) {
			return models.Card{UserID: otherUserID}, nil
		}}
		svc := NewCardsService(repo)

		_, err := svc.Update(userID, cardID, UpdateCardDTO{})
		if err == nil || err.Error() != "unauthorized" {
			t.Fatalf("expected unauthorized error, got %v", err)
		}
	})

	t.Run("updates fields and persists", func(t *testing.T) {
		existing := models.Card{UserID: userID, Title: "Old", Content: "Old", Status: string(CardStatusUndone)}
		repo := &fakeCardsRepository{findByID: func(id uuid.UUID) (models.Card, error) {
			if id != cardID {
				return models.Card{}, errors.New("unexpected card id")
			}
			return existing, nil
		}}
		svc := NewCardsService(repo)

		title := "New"
		content := "NewC"
		status := CardStatusDone
		resp, err := svc.Update(userID, cardID, UpdateCardDTO{Title: &title, Content: &content, Status: &status})
		if err != nil {
			t.Fatalf("expected nil error, got %v", err)
		}
		if repo.updatedCard == nil {
			t.Fatalf("expected Update called")
		}
		if repo.updatedCard.Title != title || repo.updatedCard.Content != content || repo.updatedCard.Status != string(CardStatusDone) {
			t.Fatalf("unexpected updated card: %+v", repo.updatedCard)
		}
		if resp.Title != title || resp.Content != content || resp.Status != CardStatusDone {
			t.Fatalf("unexpected response: %+v", resp)
		}
	})
}

