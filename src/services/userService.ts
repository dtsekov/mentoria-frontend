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