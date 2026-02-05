import { create } from 'zustand';
import { Card, CardStatus } from '@/types';
import { cardsService } from '@/services/cardsService';
import { mockCards } from '@/lib/mockData';

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  addCard: (card: { title: string; content: string; status: CardStatus }) => Promise<void>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  addMultipleCards: (newCards: Card[]) => void;
  getCardById: (id: string) => Card | undefined;
}

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: mockCards,
  isLoading: false,

  addCard: async (cardData) => {
    set({ isLoading: true });
    
    const response = await cardsService.createCard(cardData, 'user-1');
    
    if (response.success && response.card) {
      set((state) => ({ 
        cards: [response.card!, ...state.cards],
        isLoading: false 
      }));
    } else {
      set({ isLoading: false });
    }
  },

  updateCard: async (id, updates) => {
    set({ isLoading: true });
    
    const response = await cardsService.updateCard(id, updates, get().cards);
    
    if (response.success && response.card) {
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === id ? response.card! : card
        ),
        isLoading: false,
      }));
    } else {
      set({ isLoading: false });
    }
  },

  deleteCard: async (id) => {
    set({ isLoading: true });
    
    const response = await cardsService.deleteCard(id, get().cards);
    
    if (response.success) {
      set((state) => ({
        cards: state.cards.filter((card) => card.id !== id),
        isLoading: false,
      }));
    } else {
      set({ isLoading: false });
    }
  },

  addMultipleCards: (newCards) => {
    set((state) => ({ cards: [...newCards, ...state.cards] }));
  },

  getCardById: (id) => {
    return get().cards.find((card) => card.id === id);
  },
}));

// Alias para manter compatibilidade
export const useCards = useCardsStore;
