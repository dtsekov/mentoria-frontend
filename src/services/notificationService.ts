import api from './api';
import type { Notification } from '@/types';

/**
 * Obtiene todas las notificaciones del usuario actual
 * (el backend filtra según el token de autenticación).
 */
export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get<Notification[]>('/notifications/');
  return response.data;
}

/**
 * Devuelve el número de notificaciones sin leer del usuario actual.
 */
export async function getUnreadCount(): Promise<number> {
  const notifications = await getNotifications();
  return notifications.filter((n) => !n.leida).length;
}

/*
* Cambia el estado de leida a true
*/
export async function patchNotification(id: number, data: Partial<Notification>): Promise<Notification> {
  const response = await api.patch<Notification>(`/notifications/${id}/`, data);
  return response.data;
}