import { Repository } from '../../../core/interfaces/Repository';
import { Event } from '../entities/Event';
import { EventTags } from '../value-objects/EventTags';
import { EventStatus, EventStatusEnum } from '../value-objects/EventStatus';

/**
 * Interfaz para filtros de búsqueda de eventos
 */
export interface EventFilters {
  /**
   * ID del organizador
   */
  organizerId?: string;
  
  /**
   * Estado del evento
   */
  status?: EventStatusEnum | EventStatus;
  
  /**
   * Fecha de inicio mínima
   */
  startDateFrom?: Date;
  
  /**
   * Fecha de inicio máxima
   */
  startDateTo?: Date;
  
  /**
   * Término de búsqueda (título, descripción, ubicación)
   */
  query?: string;
  
  /**
   * Etiquetas para filtrar
   */
  tags?: string[] | EventTags;
  
  /**
   * Ciudad
   */
  city?: string;
  
  /**
   * País
   */
  country?: string;
  
  /**
   * Solo eventos virtuales
   */
  virtualOnly?: boolean;
  
  /**
   * Solo eventos con capacidad disponible
   */
  availableCapacity?: boolean;
}

/**
 * Opciones de paginación y ordenamiento
 */
export interface PaginationOptions {
  /**
   * Número de página (comienza en 1)
   */
  page: number;
  
  /**
   * Cantidad de elementos por página
   */
  limit: number;
  
  /**
   * Campo por el cual ordenar
   */
  orderBy?: 'startDate' | 'createdAt' | 'title';
  
  /**
   * Dirección del ordenamiento
   */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interfaz para el repositorio de eventos
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para eventos
 */
export interface EventRepository extends Repository<Event, string> {
  /**
   * Encuentra eventos con filtros y paginación
   * @param filters Filtros para la búsqueda
   * @param options Opciones de paginación
   * @returns Lista de eventos y total
   */
  findWithFilters(
    filters: EventFilters,
    options?: PaginationOptions
  ): Promise<{ events: Event[]; total: number }>;
  
  /**
   * Encuentra eventos organizados por un usuario
   * @param organizerId ID del organizador
   * @returns Lista de eventos
   */
  findByOrganizerId(organizerId: string): Promise<Event[]>;
  
  /**
   * Encuentra eventos por estado
   * @param status Estado del evento
   * @returns Lista de eventos
   */
  findByStatus(status: EventStatusEnum | EventStatus): Promise<Event[]>;
  
  /**
   * Encuentra eventos que coincidan con etiquetas
   * @param tags Etiquetas a buscar
   * @returns Lista de eventos
   */
  findByTags(tags: string[] | EventTags): Promise<Event[]>;
  
  /**
   * Encuentra eventos cercanos a una fecha
   * @param date Fecha de referencia
   * @param daysBefore Días antes de la fecha
   * @param daysAfter Días después de la fecha
   * @returns Lista de eventos
   */
  findByDateRange(date: Date, daysBefore: number, daysAfter: number): Promise<Event[]>;
  
  /**
   * Encuentra eventos que tengan lugar en una ciudad
   * @param city Ciudad
   * @returns Lista de eventos
   */
  findByCity(city: string): Promise<Event[]>;
  
  /**
   * Busca eventos por término de búsqueda
   * @param query Término de búsqueda
   * @returns Lista de eventos
   */
  search(query: string): Promise<Event[]>;
  
  /**
   * Actualiza el estado de un evento
   * @param id ID del evento
   * @param status Nuevo estado
   * @returns Evento actualizado o null si no existe
   */
  updateStatus(id: string, status: EventStatusEnum | EventStatus): Promise<Event | null>;
  
  /**
   * Añade un asistente a un evento
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Evento actualizado o null si no existe
   */
  addAttendee(eventId: string, userId: string): Promise<Event | null>;
  
  /**
   * Elimina un asistente de un evento
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Evento actualizado o null si no existe
   */
  removeAttendee(eventId: string, userId: string): Promise<Event | null>;
  
  /**
   * Encuentra los próximos eventos para un usuario
   * @param userId ID del usuario
   * @returns Lista de eventos
   */
  findUpcomingByUserId(userId: string): Promise<Event[]>;
  
  /**
   * Encuentra eventos a los que asiste un usuario
   * @param userId ID del usuario
   * @returns Lista de eventos
   */
  findByAttendeeId(userId: string): Promise<Event[]>;
} 