import { Organizer } from '../../users/types';

// Re-exportamos Organizer para que esté disponible cuando se importe desde este módulo
export { Organizer };

/**
 * Tipo de evento básico
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  image?: string;
  startDate: string;
  endDate: string;
  location: string | EventLocation;
  price?: number;
  category: string | EventCategory;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    photoURL?: string;
    website?: string;
  };
  attendees?: number;
  maxCapacity?: number;
  isVirtual?: boolean;
  status?: string;
  url?: string;
  distance?: number;
  attendeesCount?: number;
  ticketsAvailable?: number;
  websiteUrl?: string;
}

/**
 * Comentario de un evento
 */
export interface Comment {
  id: string;
  eventId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  likes?: number;
  replies?: Comment[];
}

/**
 * Estados posibles de un evento
 */
export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  PAST = 'past',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed'
}

/**
 * Categorías de eventos
 */
// Usamos un tipo de string para facilitar su uso en el código
export type EventCategory = string;

// Enumeración con las categorías estándar para controlar los valores posibles
export enum EventCategoryEnum {
  MUSIC = 'MUSIC',
  TECHNOLOGY = 'TECHNOLOGY',
  BUSINESS = 'BUSINESS',
  ARTS = 'ARTS',
  SPORTS = 'SPORTS',
  FOOD = 'FOOD',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  SOCIAL = 'SOCIAL',
  TRAVEL = 'TRAVEL',
  ENTERTAINMENT = 'ENTERTAINMENT',
  CHARITY = 'CHARITY',
  OTHER = 'OTHER',
  LIFESTYLE = 'LIFESTYLE'
}

// Interfaz para categoría de evento con metadatos
export interface EventCategoryInfo {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Tipos de eventos
 */
export enum EventType {
  INPERSON = 'INPERSON',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID'
}

/**
 * Visibilidad de eventos
 */
export enum EventVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY'
}

/**
 * Datos para la creación de un evento
 */
export interface CreateEventData {
  title: string;
  description: string;
  imageUrl?: string;
  location: string | EventLocation;
  address?: string;
  startDate: string;
  endDate: string;
  type: EventType;
  category: string;
  organizerId: string;
  price?: number;
  capacity: number;
  isPrivate?: boolean;
  ticketInfo?: EventTicketInfo;
  websiteUrl?: string;
  latitude?: number;
  longitude?: number;
}

// Alias para compatibilidad
export type CreateEventParams = CreateEventData;

/**
 * Datos para la actualización de un evento
 */
export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  price?: number;
  capacity?: number;
  imageUrl?: string;
  status?: EventStatus;
  tags?: string[];
  isVirtual?: boolean;
  virtualUrl?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Filtros para la búsqueda de eventos
 */
export interface EventFilters {
  categories: EventCategory[];
  date?: {
    from?: Date;
    to?: Date;
  };
  price?: {
    min?: number;
    max?: number;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  keywords?: string[];
  isVirtual?: boolean;
  isFree?: boolean;
}

/**
 * Respuesta paginada de eventos
 */
export interface EventSearchResult {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Datos para la creación de un evento
 */
export interface EventLocation {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  venueId?: string;
  venueName?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Datos para la creación de un evento
 */
export interface EventTimeSlot {
  start: string;
  end: string;
  title?: string;
  description?: string;
}

/**
 * Datos para la creación de un evento
 */
export interface EventMetrics {
  maxCapacity: number;
  registeredAttendees: number;
  checkedInAttendees: number;
  viewCount: number;
  saveCount: number;
  shareCount: number;
}

/**
 * Datos para la creación de un evento
 */
export interface TicketType {
  name: string;
  price: number;
  availableCount: number;
  benefits?: string[];
}

/**
 * Datos para la creación de un evento
 */
export interface EventTicketInfo {
  price: number;
  availableTickets: number;
  ticketTypes?: TicketType[];
  isFree?: boolean;
  currency?: string;
}

/**
 * Datos para la creación de un evento
 */
export interface EventSocialInfo {
  hashtags?: string[];
  socialAccounts?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

// Simplificado para listados
export interface EventListItem {
  id: string;
  title: string;
  startDate: string;
  location: string;
  imageUrl?: string;
  price?: number;
  category?: string;
}

// Interfaz para respuesta de listado de eventos
export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
}

// Interfaz para detalles completos de un evento
export interface EventDetail extends Event {
  description: string;
  schedule?: EventScheduleItem[];
  faqs?: EventFAQ[];
  reviews?: EventReview[];
  relatedEvents?: Event[];
  terms?: string;
}

// Interfaz para elementos del programa/agenda de un evento
export interface EventScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  speakers?: EventSpeaker[];
  location?: string;
}

// Interfaz para ponentes/presentadores de un evento
export interface EventSpeaker {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  role?: string;
  company?: string;
}

// Interfaz para preguntas frecuentes de un evento
export interface EventFAQ {
  question: string;
  answer: string;
}

// Interfaz para reseñas de eventos
export interface EventReview {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment?: string;
  createdAt: string;
} 