// Tipos de roles de usuario
export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

// Estado de la cuenta del usuario
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

// Categorías o temas de interés para el usuario
export enum InterestCategory {
  MUSIC = 'MUSIC',
  SPORTS = 'SPORTS',
  TECHNOLOGY = 'TECHNOLOGY',
  ARTS = 'ARTS',
  FOOD = 'FOOD',
  EDUCATION = 'EDUCATION',
  BUSINESS = 'BUSINESS',
  HEALTH = 'HEALTH',
  SOCIAL = 'SOCIAL',
  TRAVEL = 'TRAVEL',
}

// Ubicación del usuario
export interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
}

// Información del usuario
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  photoURL?: string;
  bio?: string;
  location?: UserLocation;
  role: UserRole;
  status: AccountStatus;
  interests: InterestCategory[];
  followersCount: number;
  followingCount: number;
  eventsAttended: number;
  eventsOrganized: number;
  createdAt: string;
  updatedAt: string;
}

// Perfil completo del usuario para uso interno
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  photoURL?: string;
  bio?: string;
  location?: UserLocation;
  interests: InterestCategory[];
  followersCount: number;
  followingCount: number;
  eventsAttended: number;
  eventsOrganized: number;
  createdAt: string;
  updatedAt: string;
}

// Perfil público visible para otros usuarios
export interface PublicUserProfile {
  id: string;
  username: string;
  fullName: string;
  photoURL?: string;
  bio?: string;
  location?: UserLocation;
  interests: InterestCategory[];
  followersCount: number;
  followingCount: number;
  eventsAttended: number;
  eventsOrganized: number;
  isFollowing?: boolean;
  createdAt?: string;
}

// Preferencias del usuario (configuración)
export interface UserAppPreferences {
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  eventRemindersEnabled: boolean;
  darkModeEnabled: boolean;
  language: string;
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'followers';
    locationSharing: boolean;
    activitySharing: boolean;
    showLocation: boolean;
    showUpcomingEvents: boolean;
  };
  displaySettings?: {
    showEventDistance: boolean;
    listViewPreferred: boolean;
    showPrices: boolean;
  };
  categories: InterestCategory[];
}

// Parámetros para actualizar el perfil
export interface UpdateProfileParams {
  fullName?: string;
  username?: string;
  bio?: string;
  phoneNumber?: string;
  location?: UserLocation;
  interests?: InterestCategory[];
  photoURL?: string;
}

// Parámetros para actualizar preferencias
export interface UpdatePreferencesParams {
  notificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  eventRemindersEnabled?: boolean;
  eventReminderTime?: number;
  darkModeEnabled?: boolean;
  language?: string;
  currency?: string;
  privacySettings?: {
    profileVisibility?: 'public' | 'followers' | 'private';
    locationSharing?: boolean;
    activitySharing?: boolean;
    showLocation?: boolean;
    showUpcomingEvents?: boolean;
  };
  displaySettings?: {
    showEventDistance?: boolean;
    listViewPreferred?: boolean;
    showPrices?: boolean;
  };
  categories?: InterestCategory[];
}

// Parámetros para actualizar el perfil - renombrando para mantener compatibilidad
export interface ProfileUpdateData extends UpdateProfileParams {}

// Respuesta al guardar un evento
export interface SavedEventResponse {
  id: string;
  name: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

// Respuesta con eventos del usuario
export interface UserEventsResponse {
  attending: any[];
  organized: any[];
  saved: any[];
}

// Estadísticas del usuario
export interface UserStats {
  eventsAttended: number;
  eventsOrganized: number;
  followers: number;
  following: number;
  totalInteractions: number;
  savedEvents: number;
} 