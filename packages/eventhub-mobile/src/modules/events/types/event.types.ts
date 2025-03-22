// Enumeración para los tipos de evento
export enum EventType {
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  CONCERT = 'CONCERT',
  FESTIVAL = 'FESTIVAL',
  MEETUP = 'MEETUP',
  EXHIBITION = 'EXHIBITION',
  SPORTS = 'SPORTS',
  PARTY = 'PARTY',
  NETWORKING = 'NETWORKING',
  OTHER = 'OTHER'
}

// Enumeración para las categorías de evento
export enum EventCategory {
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
  OTHER = 'OTHER'
}

// Estado de un evento
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED'
}

// Tipos de visibilidad de un evento
export enum EventVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY'
}

// Ubicación del evento
export interface EventLocation {
  address?: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  venueDetails?: string;
}

// Información sobre precios y entradas
export interface EventTicketInfo {
  isFree: boolean;
  price?: number;
  currency?: string;
  ticketsAvailable?: number;
  ticketsSold?: number;
  ticketUrl?: string;
  salesStartDate?: string;
  salesEndDate?: string;
}

// Métricas y estadísticas del evento
export interface EventMetrics {
  views: number;
  shares: number;
  favorites: number;
  attendees: number;
  maxCapacity?: number;
  registrations: number;
}

// Contacto del organizador
export interface EventContact {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
}

// Interfaz principal para un evento
export interface Event {
  id: number | string;
  title: string;
  description: string;
  shortDescription?: string;
  location: string | EventLocation;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  category: string | EventCategory;
  type?: EventType;
  tags?: string[];
  imageUrl?: string;
  imageUrls?: string[];
  status?: EventStatus;
  visibility?: EventVisibility;
  isAttending?: boolean;
  isFavorite?: boolean;
  ticketInfo?: EventTicketInfo;
  metrics?: EventMetrics;
  organizerId: number | string;
  organizerName?: string;
  organizerLogo?: string;
  contact?: EventContact;
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

// Parámetros para búsqueda de eventos
export interface EventSearchParams {
  query?: string;
  category?: string | EventCategory;
  type?: string | EventType;
  startDate?: string;
  endDate?: string;
  location?: string;
  city?: string;
  country?: string;
  isFree?: boolean;
  maxPrice?: number;
  tags?: string[];
  status?: EventStatus;
}

// Respuesta de una búsqueda paginada
export interface EventSearchResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Parámetros para creación de eventos
export interface CreateEventParams {
  title: string;
  description: string;
  shortDescription?: string;
  location: string | EventLocation;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  category: string | EventCategory;
  type?: EventType;
  tags?: string[];
  imageUrl?: string;
  imageUrls?: string[];
  status?: EventStatus;
  visibility?: EventVisibility;
  ticketInfo?: EventTicketInfo;
  organizerId: number | string;
  organizerName?: string;
  organizerLogo?: string;
  contact?: EventContact;
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
  maxCapacity?: number;
}

// Tipo para actualizaciones parciales
export type UpdateEventParams = Partial<CreateEventParams>; 