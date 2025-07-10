import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as loginService, logout as logoutClient } from '@/services/authService';
import type { DecodedToken, Rol } from '@/types';
import {jwtDecode} from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const userId = ref<number | null>(null);
  const rol = ref<Rol | null>(null);

  if (token.value) {
    try {
      const decoded = jwtDecode<DecodedToken>(token.value);
      userId.value = decoded.user_id;
      rol.value = decoded.rol_actual;
    } catch (e) {
      console.error('Token inválido', e);
      logout(); // borra token inválido
    }
  }

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    const response = await loginService(email, password);
    token.value = response.access;
    localStorage.setItem('auth_token', response.access);

    const decoded = jwtDecode<DecodedToken>(response.access);
    userId.value = decoded.user_id;
    rol.value = decoded.rol_actual;

    return true;
  }

  function logout() {
    logoutClient();
    token.value = null;
    userId.value = null;
    rol.value = null;
  }

  return {
    token,
    userId,
    rol,
    isAuthenticated,
    login,
    logout
  };
});