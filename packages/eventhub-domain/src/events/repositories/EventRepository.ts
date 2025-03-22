import { Repository } from '../../core/interfaces/Repository';
import { Event } from '../entities/Event';
import { EventTags } from '../value-objects/EventTags';
import { EventStatus, EventStatusEnum } from '../value-objects/EventStatus';

/**
 * Interfaz para filtros de búsqueda de eventos
 * Permite filtrar eventos por diferentes criterios como organizador, fechas, ubicación, etc.
 */
export interface EventFilters {
  /**
   * ID del organizador para filtrar eventos por creador
   */
  organizerId?: string;
  
  /**
   * Estado del evento (borrador, publicado, cancelado, etc.)
   */
  status?: EventStatusEnum | EventStatus;
  
  /**
   * Fecha de inicio mínima para filtrar eventos que comienzan después de esta fecha
   */
  startDateFrom?: Date;
  
  /**
   * Fecha de inicio máxima para filtrar eventos que comienzan antes de esta fecha
   */
  startDateTo?: Date;
  
  /**
   * Término de búsqueda para filtrar por título, descripción o ubicación
   */
  query?: string;
  
  /**
   * Etiquetas para filtrar eventos por categorías o temas
   */
  tags?: string[] | EventTags;
  
  /**
   * Ciudad donde se realiza el evento
   */
  city?: string;
  
  /**
   * País donde se realiza el evento
   */
  country?: string;
  
  /**
   * Indica si se deben filtrar solo eventos virtuales
   */
  virtualOnly?: boolean;
  
  /**
   * Indica si se deben filtrar solo eventos con capacidad disponible
   */
  availableCapacity?: boolean;
}

/**
 * Opciones de paginación y ordenamiento para búsquedas de eventos
 * Permite controlar la cantidad de resultados y su orden
 */
export interface PaginationOptions {
  /**
   * Número de página a recuperar (comienza en 1)
   */
  page: number;
  
  /**
   * Cantidad de elementos por página
   */
  limit: number;
  
  /**
   * Campo por el cual ordenar los resultados
   */
  orderBy?: 'startDate' | 'createdAt' | 'title';
  
  /**
   * Dirección del ordenamiento (ascendente o descendente)
   */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Resultado paginado de una búsqueda de eventos
 */
export interface PaginatedEventsResult {
  /** Lista de eventos encontrados */
  events: Event[];
  /** Número total de eventos que coinciden con el filtro */
  total: number;
}

/**
 * Interfaz del repositorio de eventos
 * Define todas las operaciones disponibles para persistencia y recuperación de eventos
 * Extiende la interfaz Repository base añadiendo métodos específicos para eventos
 */
export interface EventRepository extends Repository<Event, string> {
  /**
   * Encuentra eventos aplicando filtros y paginación
   * @param filters Filtros para refinar la búsqueda de eventos
   * @param options Opciones de paginación y ordenamiento
   * @returns Objeto con eventos encontrados y total de coincidencias
   */
  findWithFilters(
    filters: EventFilters,
    options?: PaginationOptions
  ): Promise<PaginatedEventsResult>;
  
  /**
   * Encuentra eventos organizados por un usuario específico
   * @param organizerId ID del usuario organizador
   * @returns Lista de eventos organizados por el usuario
   */
  findByOrganizerId(organizerId: string): Promise<Event[]>;
  
  /**
   * Encuentra eventos que tengan un estado específico
   * @param status Estado del evento a filtrar
   * @returns Lista de eventos con el estado indicado
   */
  findByStatus(status: EventStatusEnum | EventStatus): Promise<Event[]>;
  
  /**
   * Encuentra eventos que incluyan ciertas etiquetas
   * @param tags Etiquetas a buscar en los eventos
   * @returns Lista de eventos que contienen las etiquetas especificadas
   */
  findByTags(tags: string[] | EventTags): Promise<Event[]>;
  
  /**
   * Encuentra eventos que ocurrirán en un rango de fechas específico
   * @param date Fecha de referencia central
   * @param daysBefore Días anteriores a la fecha de referencia
   * @param daysAfter Días posteriores a la fecha de referencia
   * @returns Lista de eventos dentro del rango de fechas
   */
  findByDateRange(date: Date, daysBefore: number, daysAfter: number): Promise<Event[]>;
  
  /**
   * Encuentra eventos que se realizarán en una ciudad específica
   * @param city Nombre de la ciudad
   * @returns Lista de eventos en la ciudad especificada
   */
  findByCity(city: string): Promise<Event[]>;
  
  /**
   * Busca eventos que coincidan con un término de búsqueda
   * @param query Término de búsqueda para título, descripción o ubicación
   * @returns Lista de eventos que coinciden con la búsqueda
   */
  search(query: string): Promise<Event[]>;
  
  /**
   * Actualiza el estado de un evento existente
   * @param id ID del evento a actualizar
   * @param status Nuevo estado a asignar
   * @returns Evento actualizado o null si no existe
   */
  updateStatus(id: string, status: EventStatusEnum | EventStatus): Promise<Event | null>;
  
  /**
   * Registra a un usuario como asistente a un evento
   * @param eventId ID del evento
   * @param userId ID del usuario asistente
   * @returns Evento actualizado o null si no existe
   */
  addAttendee(eventId: string, userId: string): Promise<Event | null>;
  
  /**
   * Elimina a un usuario de la lista de asistentes de un evento
   * @param eventId ID del evento
   * @param userId ID del usuario a eliminar de asistentes
   * @returns Evento actualizado o null si no existe
   */
  removeAttendee(eventId: string, userId: string): Promise<Event | null>;
  
  /**
   * Encuentra los próximos eventos a los que asistirá un usuario
   * @param userId ID del usuario
   * @returns Lista de eventos futuros a los que asistirá el usuario
   */
  findUpcomingByUserId(userId: string): Promise<Event[]>;
  
  /**
   * Encuentra todos los eventos a los que un usuario asiste o ha asistido
   * @param userId ID del usuario
   * @returns Lista completa de eventos a los que asiste el usuario
   */
  findByAttendeeId(userId: string): Promise<Event[]>;

  /**
   * Cuenta eventos publicados
   * @returns Total de eventos publicados
   */
  countPublishedEvents(): Promise<number>;

  /**
   * Cuenta eventos próximos
   * @returns Total de eventos próximos
   */
  countUpcomingEvents(): Promise<number>;

  /**
   * Cuenta eventos cancelados
   * @returns Total de eventos cancelados
   */
  countCancelledEvents(): Promise<number>;

  /**
   * Obtiene estadísticas de eventos por día
   * @param since Fecha desde la que obtener estadísticas
   * @returns Estadísticas de eventos por día
   */
  getEventsPerDay(since?: Date): Promise<{ date: string; count: number }[]>;

  /**
   * Obtiene los eventos más populares
   * @param limit Número de eventos a obtener
   * @param since Fecha desde la que contar
   * @returns Lista de eventos más populares
   */
  getMostPopularEvents(limit: number, since?: Date): Promise<Event[]>;
} 