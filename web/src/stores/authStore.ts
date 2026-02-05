import { create } from "zustand";
import { User } from "@/types";
import authService from "@/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true });

    const response = await authService.login({ email, password });

    if (response.success && response.user) {
      set({ user: response.user, isAuthenticated: true, isLoading: false });
      return true;
    }

    set({ isLoading: false });
    return false;
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    set({ isLoading: true });

    const response = await authService.register({ name, email, password });

    if (response.success) {
      await get().login(email, password);
      set({ isAuthenticated: true, isLoading: false });
      return true;
    }

    set({ isLoading: false });
    return false;
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

// Alias para manter compatibilidade
export const useAuth = useAuthStore;
