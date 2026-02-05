export type CardStatus = "done" | "undone" | "doing";

export type Card = {
  id: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  content: string;
  status: CardStatus;
  user_id: string;
};

export type SimpleCard = Pick<Card, "title" | "content" | "status">;

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export type ApiResponse<T> = {
  status: number;
  message: string;
  data?: T;
};
