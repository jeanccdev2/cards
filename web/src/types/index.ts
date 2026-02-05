export type CardStatus = "done" | "pending" | "doing";

export type Card = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  status: CardStatus;
  userId: string;
};

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
