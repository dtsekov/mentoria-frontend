import api from './api';
import type { User } from '@/types';

export async function getUsuarioById(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}/`);
  return response.data;
}
