import api from './api';
import type { SolicitudRol, SolicitudRolTipo } from '@/types';

// GET todas las solicitudes del usuario
export async function getSolicitudesRol(): Promise<SolicitudRol[]> {
  const res = await api.get<SolicitudRol[]>('/roles/');
  return res.data;
}

// POST nueva solicitud
export async function postSolicitudRol(data: {
  tipo: SolicitudRolTipo;
  contenido: string;
}): Promise<SolicitudRol> {
  const res = await api.post<SolicitudRol>('/roles/', data);
  return res.data;
}

export async function patchSolicitudRol(id: number, data: Partial<SolicitudRol>) {
  await api.patch(`/roles/${id}/`, data);
}