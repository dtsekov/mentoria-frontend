import api from './api';
import type { User } from '@/types';

export async function getUsuarioById(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}/`);
  return response.data;
}

export async function patchUsuario(id: number, data: Partial<User>): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/`, data);
  return response.data;
}

export async function getUsuarios(): Promise<User[]> {
  const res = await api.get<User[]>('/users/');
  return res.data;
}

export async function postUsuario(userData: { email: string; password: string }): Promise<User> {
  const response = await api.post<User>('/users/', userData);
  return response.data;
}
