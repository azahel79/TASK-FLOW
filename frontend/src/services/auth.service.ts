import api from '@/lib/api';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  async getProfile(): Promise<AuthResponse['user']> {
    const response = await api.get<ApiResponse<AuthResponse['user']>>('/auth/profile');
    return response.data.data;
  },
};