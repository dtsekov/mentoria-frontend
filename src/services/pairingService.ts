import api from './api';
import type { Pairing } from '@/types';

// Trae todos los emparejamientos del cuatrimestre actual (para coordinador)
// o sólo del usuario logueado (para mentor/mentorizado).
export async function getPairings(): Promise<Pairing[]> {
  const res = await api.get<Pairing[]>('/pairings/');
  return res.data;
}

// Crea un nuevo emparejamiento
export async function createPairing(data: { mentor: number; mentorizado: number }): Promise<Pairing> {
  const res = await api.post<Pairing>('/pairings/', data);
  return res.data;
}