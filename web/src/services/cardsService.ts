import { ApiResponse, Card, CardStatus, SimpleCard } from "@/types";
import { mockCards, generateMockCardsFromVoice } from "@/lib/mockData";
import { api } from "@/config/api";

export type CardsListResponse = {
  success: boolean;
  cards?: Card[];
  error?: string;
};

async function fetchCards(): Promise<CardsListResponse> {
  try {
    const { data } = await api.get<ApiResponse<Card[]>>(`/cards/list`);

    return {
      success: true,
      cards: data?.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao buscar cards",
    };
  }
}

export type CardByIdResponse = {
  success: boolean;
  card?: Card;
  error?: string;
};

async function getCardById(id: string): Promise<CardByIdResponse> {
  try {
    const { data } = await api.get<ApiResponse<Card>>(`/cards/by_id/${id}`);

    return {
      success: true,
      card: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao buscar card",
    };
  }
}

export type CreateCardRequest = Omit<SimpleCard, "status">;

export type CreateCardResponse = {
  success: boolean;
  card?: Card;
  error?: string;
};

async function createCard(
  card: CreateCardRequest,
): Promise<CreateCardResponse> {
  try {
    const { data } = await api.post<ApiResponse<Card>>(`/cards/create`, card);

    return {
      success: true,
      card: data?.data || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao criar card",
    };
  }
}

export type UpdateCardRequest = Partial<SimpleCard>;

export type UpdateCardResponse = {
  success: boolean;
  card?: Card;
  error?: string;
};

async function updateCard(
  id: string,
  card: UpdateCardRequest,
): Promise<UpdateCardResponse> {
  try {
    const { data } = await api.patch<ApiResponse<Card>>(
      `/cards/update/${id}`,
      card,
    );

    return {
      success: true,
      card: data?.data || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao atualizar card",
    };
  }
}

export type DeleteCardResponse = {
  success: boolean;
  error?: string;
};

async function deleteCard(id: string): Promise<DeleteCardResponse> {
  try {
    await api.delete(`/cards/update/${id}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao atualizar card",
    };
  }
}

export type GenerateCardsResponse = {
  success: boolean;
  cards?: SimpleCard[];
  error?: string;
};

async function generateCardsFromVoice(
  userPrompt: string,
): Promise<GenerateCardsResponse> {
  try {
    const { data } = await api.post<ApiResponse<SimpleCard[]>>(
      `/cards/generate_multiple_cards`,
      {
        userPrompt,
      },
    );

    return {
      success: true,
      cards: data?.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao atualizar card",
    };
  }
}

export type CreateMultipleCardsResponse = {
  success: boolean;
  cards?: Card[];
  error?: string;
};

async function createMultipleCards(
  cards: SimpleCard[],
): Promise<CreateMultipleCardsResponse> {
  try {
    const { data } = await api.post<ApiResponse<Card[]>>(
      `/cards/create_multiple_cards`,
      cards,
    );

    return {
      success: true,
      cards: data?.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: "Erro ao atualizar card",
    };
  }
}

export default {
  fetchCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  generateCardsFromVoice,
  createMultipleCards,
};
