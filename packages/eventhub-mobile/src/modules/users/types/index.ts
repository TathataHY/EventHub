import { Event } from '../../events/types';

/**
 * Tipo básico de usuario
 */
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

/**
 * Perfil extendido del usuario
 */
export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  followers?: number;
  following?: number;
  eventsCreated?: number;
  eventsAttending?: number;
  joinDate?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Datos para actualizar el perfil de usuario
 */
export interface ProfileUpdateData {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Respuesta de evento guardado como favorito
 */
export interface SavedEventResponse {
  eventId: string;
  saved: boolean;
  message: string;
}

/**
 * Respuesta de eventos del usuario
 */
export interface UserEventsResponse {
  events: Event[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Estadísticas del usuario
 */
export interface UserStats {
  eventsCreated: number;
  eventsAttending: number;
  followers: number;
  following: number;
  tickets: number;
  engagement: number;
} 