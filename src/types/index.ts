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

export type SolicitudRolEstado = 'pendiente' | 'aceptada' | 'rechazada';
export type SolicitudRolTipo = 'mentor' | 'mentorizado';

export interface SolicitudRol {
  id: number;
  usuario: number;
  tipo: SolicitudRolTipo;
  fecha_envio: string;
  contenido: string;
  estado: SolicitudRolEstado;
  comentario_coordinador: string | null;
  created_at: string;
  updated_at: string;
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

export interface Informe {
  id: number;
  tipo: 'seguimiento1' | 'seguimiento2' | 'final';
  user: number;
  emparejamiento: number;

  fecha_entrega: string; // ISO datetime

  // Campos comunes
  curso: string;
  grupo: string;
  nombre_completo: string;
  num_reuniones: number;
  temas_reuniones: string;
  horas_dedicadas: number;
  satisfaccion: string;
  recomendacion: string;
  tipo_actividades: string;
  observaciones_generales: string;
  mejoras_sugeridas: string;

  // Seguimiento (mentor)
  problemas_detectados: string;
  participacion_mentorizada: string;

  // Seguimiento (mentorizado)
  actividades_realizadas: string;
  ayuda_recibida: string;

  // Final (mentor)
  labor_mentor: string;
  seguimiento: string;
  labor_positiva_integracion: string;
  mejora_implicacion: string;
  comunicacion: string;
  organizacion: string;
  beneficio_mentor: string;

  // Final (mentorizado)
  labor_mentorizado: string;
  mejorar_organizacion: string;
  conocer_escuela: string;
  relaciones_personales: string;
  examenes: string;
  calificaciones: string;
  no_abandono: string;
  informacion: string;
  claridad_explicaciones: string;
  trato: string;
  facil_contacto: string;
  futuro_mentor: string;
  trabajo_mentor: string;

  // Shared final
  ventajas_inconvenientes: string;
  mejoras_finales: string;

  // Estado y metadatos
  estado: 'pendiente' | 'aprobado' | 'devuelto';
  observaciones: string | null;
  created_at: string;   // ISO datetime
  updated_at: string;   // ISO datetime
}