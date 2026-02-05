import { ApiResponse, User } from "@/types";
import { mockUser } from "@/lib/mockData";
import { api } from "@/config/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type ApiLoginResponse = {
  token: string;
  user: User;
};

export type LoginResponse = {
  success: boolean;
  user?: User;
  error?: string;
};

// Simula delay de rede
const simulateNetworkDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function login({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await api.post<ApiResponse<ApiLoginResponse>>(
      "/auth/login",
      {
        email,
        password,
      },
    );

    localStorage.setItem("token", data.data?.token || "");

    return { success: true, user: data.data?.user || mockUser };
  } catch (error) {
    console.error("authService login error: ", error);
    return { success: false, error: "Erro ao registrar usuário" };
  }
}

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type ApiRegisterResponse = User;

export type RegisterResponse = {
  success: boolean;
  error?: string;
};

async function register({
  name,
  email,
  password,
}: RegisterRequest): Promise<RegisterResponse> {
  try {
    await api.post<ApiResponse<ApiRegisterResponse>>("/auth/register", {
      name,
      email,
      password,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao registrar usuário" };
  }
}

async function logout(): Promise<void> {
  localStorage.removeItem("token");
}

export default {
  login,
  register,
  logout,
};
