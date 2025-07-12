// src/services/passwordResetService.ts
import  api  from '@/services/api'; // Asumiendo que tienes tu servicio api con la base URL

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export const passwordResetService = {
  /**
   * Solicita un reset de contraseña
   * @param email Email del usuario
   */
  async requestReset(email: string): Promise<void> {
    try {
      await api.post('/auth/password/reset/', { email });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirma el reset de contraseña con el token
   * @param token Token recibido por email
   * @param password Nueva contraseña
   */
  async confirmReset(token: string, password: string): Promise<void> {
    try {
      await api.post('/auth/password/reset/confirm/', {
        token,
        password
      });
    } catch (error) {
      throw error;
    }
  }
};