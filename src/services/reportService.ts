// src/services/reportService.ts
import api from './api';
import type { Informe } from '@/types';

export async function getInformes(): Promise<Informe[]> {
  const response = await api.get<Informe[]>('/reports/');
  return response.data;
}
export async function postInforme(data: Partial<Informe>): Promise<Informe> {
  const response = await api.post<Informe>('/reports/', data);
  return response.data;
}
export async function getInformeById(id: number): Promise<Informe> {
  const { data } = await api.get<Informe>(`/reports/${id}/`);
  return data;
}

export async function patchInforme(id: number, patch: Partial<Informe>): Promise<Informe> {
  const { data } = await api.patch<Informe>(`/reports/${id}/`, patch);
  return data;
}