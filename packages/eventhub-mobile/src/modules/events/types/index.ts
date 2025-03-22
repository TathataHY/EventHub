/**
 * Tipo de evento básico
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  organizerId: string;
  organizerName: string;
  imageUrl?: string;
  category: string;
  price: number;
  capacity: number;
  attendees: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isVirtual?: boolean;
  virtualUrl?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Estados posibles de un evento
 */
export type EventStatus = 'draft' | 'active' | 'canceled' | 'completed';

/**
 * Categorías de eventos
 */
export enum EventCategory {
  TECH = 'tech',
  BUSINESS = 'business',
  DESIGN = 'design',
  MARKETING = 'marketing',
  HEALTH = 'health',
  SPORTS = 'sports',
  MUSIC = 'music',
  ART = 'art',
  FOOD = 'food',
  EDUCATION = 'education',
  OTHER = 'other'
}

/**
 * Datos para la creación de un evento
 */
export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  tags?: string[];
  isVirtual?: boolean;
  virtualUrl?: string;
  latitude?: number;
  longitude?: number;
}

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
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  price?: {
    min?: number;
    max?: number;
  };
  status?: EventStatus;
  distance?: number;
  latitude?: number;
  longitude?: number;
  isVirtual?: boolean;
}

/**
 * Respuesta paginada de eventos
 */
export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
} 