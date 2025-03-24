import { 
  UserRole, 
  AccountStatus, 
  InterestCategory, 
  UserLocation 
} from './user.types';

export { 
  UserRole, 
  AccountStatus, 
  InterestCategory 
};

import { Event } from '../../events/types';

/**
 * Tipo para el usuario del sistema - compatible con user.types.ts User
 */
export interface User {
  id: string;
  name: string;                    // Equivalente a fullName
  email: string;
  username?: string;               // Añadido para compatibilidad
  profileImage?: string;           // Equivalente a photoURL
  bio?: string;
  location?: string | UserLocation; // Compatible con ambos formatos
  phone?: string;                  // Equivalente a phoneNumber
  role?: UserRole | 'user' | 'organizer' | 'admin';  // Compatible con ambos formatos
  settings?: UserSettings;
  stats?: UserStats;
  createdAt?: string;
  updatedAt?: string;
  followersCount?: number;         // Para compatibilidad
  followingCount?: number;         // Para compatibilidad
  eventsAttended?: number;         // Para compatibilidad
  eventsOrganized?: number;        // Para compatibilidad
  interests?: InterestCategory[] | string[]; // Compatible con ambos formatos
}

/**
 * Tipo para representar a un organizador de eventos
 */
export interface Organizer {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  verified?: boolean;
}

/**
 * Perfil público de usuario (compatible con user.types.ts PublicUserProfile)
 */
export interface PublicUserProfile {
  id: string;
  name?: string;               // Para compatibilidad
  username?: string;
  fullName?: string;           // Para compatibilidad
  profileImage?: string;
  photoURL?: string;           // Para compatibilidad
  bio?: string;
  location?: string | UserLocation;
  isFollowing?: boolean;
  isFollower?: boolean;
  stats?: {
    followersCount: number;
    followingCount: number;
    eventsAttended: number;
    eventsCreated: number;
  };
  followersCount?: number;     // Para compatibilidad directa
  followingCount?: number;     // Para compatibilidad directa
  eventsAttended?: number;     // Para compatibilidad directa
  eventsOrganized?: number;    // Para compatibilidad directa con eventsCreated
  interests?: InterestCategory[] | string[]; // Para compatibilidad
  createdAt?: string;
}

/**
 * Perfil completo de usuario (compatible con user.types.ts UserProfile)
 */
export interface UserProfile {
  // Campos obligatorios
  id: string;
  email: string;
  // Campos opcionales compartidos con User
  name?: string;
  username?: string;
  fullName?: string;
  bio?: string;
  profileImage?: string;
  photoURL?: string;
  profilePicture?: string;
  location?: string | UserLocation;
  phone?: string;
  role?: UserRole | 'user' | 'organizer' | 'admin';
  settings?: UserSettings;
  stats?: UserStats;
  createdAt?: string;
  updatedAt?: string;
  followersCount?: number;
  followingCount?: number;
  eventsAttended?: number;
  eventsOrganized?: number;
  interests?: InterestCategory[] | string[];
  // Campos adicionales específicos del perfil
  badges?: string[];
  achievements?: any[];
  following?: PublicUserProfile[];
  followers?: PublicUserProfile[];
  skills?: string[];
  eventsCreated?: number;
  eventsAttending?: string[];
}

/**
 * Configuración de usuario
 */
export interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEvents: boolean;
    showLocation: boolean;
  };
}

/**
 * Estadísticas de usuario
 */
export interface UserStats {
  eventsAttended: number;
  eventsCreated: number;
  eventsShared: number;
  eventsSaved: number;
  followersCount: number;
  followingCount: number;
  comments: number;
  likes: number;
  reviewsCount: number;
  reviewsAverage: number;
  totalTickets: number;
  gameStats?: {
    level: number;
    experience: number;
    nextLevelXP: number;
    achievements: number;
    badges: number;
  };
}

/**
 * Credenciales de autenticación
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Datos para actualizción del perfil
 */
export interface UpdateProfileData {
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

/**
 * Resultado de una operación de seguimiento de usuario
 */
export interface FollowResult {
  success: boolean;
  isFollowing: boolean;
  followersCount: number;
}

/**
 * Respuesta a la solicitud de relaciones de usuario (seguidores, siguiendo)
 */
export interface UserRelationsResponse {
  users: UserProfile[];
  total: number;
  page?: number;
  pageSize?: number;
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