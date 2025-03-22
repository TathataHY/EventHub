import { Repository } from '../../core/interfaces/Repository';
import { EventType } from '../entities/EventType';

export interface EventTypeFilters {
  name?: string;
  isActive?: boolean;
  query?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface EventTypeRepository extends Repository<string, EventType> {
  findAll(filters?: EventTypeFilters, pagination?: PaginationOptions): Promise<{
    eventTypes: EventType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  findByName(name: string): Promise<EventType[]>;
  
  /**
   * Busca tipos de eventos activos
   * @returns Lista de tipos de eventos activos
   */
  findActiveEventTypes(): Promise<EventType[]>;
  
  /**
   * Busca tipos de eventos inactivos
   * @returns Lista de tipos de eventos inactivos
   */
  findInactiveEventTypes(): Promise<EventType[]>;
  
  /**
   * Busca tipos de eventos por texto
   * @param query Texto a buscar
   * @returns Lista de tipos de eventos que coinciden
   */
  searchByText(query: string): Promise<EventType[]>;
  
  /**
   * Busca tipos de eventos activos
   * @returns Lista de tipos de eventos activos
   */
  findActive(): Promise<EventType[]>;

  /**
   * Busca tipos de eventos con paginación
   * @param page Número de página
   * @param limit Elementos por página
   * @param search Texto a buscar (opcional)
   * @returns Resultado paginado
   */
  findWithPagination(page: number, limit: number, search?: string): Promise<{
    eventTypes: EventType[];
    total: number;
  }>;

  /**
   * Verifica si existe un tipo de evento con el mismo nombre
   * @param name Nombre a verificar
   * @returns true si existe, false en caso contrario
   */
  existsByName(name: string): Promise<boolean>;
} 