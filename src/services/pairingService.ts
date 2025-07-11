import api from './api';
import type { Pairing } from '@/types';

export async function getPairings(): Promise<Pairing[]> {
  const response = await api.get<Pairing[]>('/pairings/');
  return response.data;
}