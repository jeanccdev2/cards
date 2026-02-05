import { User } from '@/types';
import { mockUser } from '@/lib/mockData';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Simula delay de rede
const simulateNetworkDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login({ email, password }: LoginRequest): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Mock: aceita qualquer email/senha válidos
    if (email && password) {
      const user: User = { ...mockUser, email };
      return { success: true, user };
    }

    return { success: false, error: 'Email ou senha inválidos' };
  },

  async register({ name, email, password }: RegisterRequest): Promise<AuthResponse> {
    await simulateNetworkDelay();

    // Mock: valida campos obrigatórios
    if (!name || !email || !password) {
      return { success: false, error: 'Todos os campos são obrigatórios' };
    }

    if (password.length < 6) {
      return { success: false, error: 'A senha deve ter pelo menos 6 caracteres' };
    }

    const user: User = { ...mockUser, name, email };
    return { success: true, user };
  },

  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    await simulateNetworkDelay();

    if (!email) {
      return { success: false, error: 'Email é obrigatório' };
    }

    // Mock: simula envio de email
    return { success: true };
  },

  async logout(): Promise<void> {
    await simulateNetworkDelay(200);
    // Mock: limpa sessão (no futuro, invalida token no backend)
  },
};
