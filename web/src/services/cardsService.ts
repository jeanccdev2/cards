import { Card, CardStatus } from '@/types';
import { mockCards, generateMockCardsFromVoice } from '@/lib/mockData';

export interface CreateCardRequest {
  title: string;
  content: string;
  status: CardStatus;
}

export interface UpdateCardRequest {
  title?: string;
  content?: string;
  status?: CardStatus;
}

export interface CardResponse {
  success: boolean;
  card?: Card;
  error?: string;
}

export interface CardsListResponse {
  success: boolean;
  cards: Card[];
  error?: string;
}

// Simula delay de rede
const simulateNetworkDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Gera ID único para novos cards
const generateCardId = () => `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const cardsService = {
  async fetchCards(): Promise<CardsListResponse> {
    await simulateNetworkDelay();
    return { success: true, cards: mockCards };
  },

  async getCardById(id: string, cards: Card[]): Promise<CardResponse> {
    await simulateNetworkDelay(100);
    
    const card = cards.find(c => c.id === id);
    
    if (!card) {
      return { success: false, error: 'Card não encontrado' };
    }

    return { success: true, card };
  },

  async createCard(data: CreateCardRequest, userId: string): Promise<CardResponse> {
    await simulateNetworkDelay();

    if (!data.title?.trim() || !data.content?.trim()) {
      return { success: false, error: 'Título e conteúdo são obrigatórios' };
    }

    const newCard: Card = {
      id: generateCardId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      title: data.title.trim(),
      content: data.content.trim(),
      status: data.status,
      userId,
    };

    return { success: true, card: newCard };
  },

  async updateCard(id: string, updates: UpdateCardRequest, currentCards: Card[]): Promise<CardResponse> {
    await simulateNetworkDelay();

    const existingCard = currentCards.find(c => c.id === id);
    
    if (!existingCard) {
      return { success: false, error: 'Card não encontrado' };
    }

    const updatedCard: Card = {
      ...existingCard,
      ...updates,
      updatedAt: new Date(),
    };

    return { success: true, card: updatedCard };
  },

  async deleteCard(id: string, currentCards: Card[]): Promise<{ success: boolean; error?: string }> {
    await simulateNetworkDelay();

    const exists = currentCards.some(c => c.id === id);
    
    if (!exists) {
      return { success: false, error: 'Card não encontrado' };
    }

    return { success: true };
  },

  async generateCardsFromVoice(audioBlob?: Blob): Promise<CardsListResponse> {
    // Simula processamento de áudio pela LLM
    await simulateNetworkDelay(2000);

    // Mock: retorna cards gerados
    const cards = generateMockCardsFromVoice();
    return { success: true, cards };
  },

  async createMultipleCards(cards: Card[]): Promise<CardsListResponse> {
    await simulateNetworkDelay();

    // Gera novos IDs e timestamps para cada card
    const newCards = cards.map(card => ({
      ...card,
      id: generateCardId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return { success: true, cards: newCards };
  },
};
