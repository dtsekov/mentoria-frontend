export type Rol = 'anonimo' | 'mentor' | 'mentorizado' | 'coordinador';

export interface DecodedToken {
  user_id: number;
  rol_actual: Rol;
  exp: number;
  iat: number;
}

export interface LoginResponse {
  access: string;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  phone_number: string;
  rol_actual: Rol;
  activo: boolean;
  fecha_activacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  usuario_id: number;
  mensaje: string;
  tipo: 'info' | 'alerta' | 'error';
  fecha_envio: string;
  leida: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pairing {
  id: number;
  mentor: number;
  mentorizado: number;
  year: number;
  cuatrimestre: number;
  fecha_emparejamiento: string;
  comentarios: string | null;
  created_at: string;
  updated_at: string;
}