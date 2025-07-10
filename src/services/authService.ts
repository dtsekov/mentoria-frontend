import api from './api';
import type { LoginResponse } from '@/types';


export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login/', { email, password });
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}