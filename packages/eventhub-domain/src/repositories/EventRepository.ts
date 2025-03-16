import { Event } from '../entities/Event';

/**
 * Interfaz para filtros de búsqueda de eventos
 */
export interface EventFilters {
  organizerId?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  query?: string;
  tags?: string[];
}

/**
 * Interfaz base para los repositorios de eventos
 */
export interface EventRepository {
  /**
   * Encuentra un evento por su ID
   * @param id ID del evento
   */
  findById(id: string): Promise<Event | null>;
  
  /**
   * Encuentra todos los eventos
   */
  findAll(): Promise<Event[]>;
  
  /**
   * Encuentra eventos con filtros
   * @param filters Filtros para la búsqueda
   * @param page Número de página (opcional)
   * @param limit Límite de eventos por página (opcional)
   */
  findWithFilters(
    filters: EventFilters,
    page?: number,
    limit?: number
  ): Promise<{ events: Event[]; total: number }>;
  
  /**
   * Encuentra eventos por ID del organizador
   * @param organizerId ID del organizador
   */
  findByOrganizerId(organizerId: string): Promise<Event[]>;
  
  /**
   * Guarda un nuevo evento
   * @param event Evento a guardar
   */
  save(event: Event): Promise<Event>;
  
  /**
   * Actualiza un evento existente
   * @param event Evento a actualizar
   */
  update(event: Event): Promise<Event>;
  
  /**
   * Elimina un evento
   * @param id ID del evento a eliminar
   */
  delete(id: string): Promise<void>;
} 