import { Repository } from '../../core/interfaces/Repository';
import { Organizer } from '../entities/Organizer';

/**
 * Filtros para búsqueda de organizadores
 */
export interface OrganizerFilters {
  name?: string;
  verified?: boolean;
  userId?: string;
}

/**
 * Opciones de paginación para organizadores
 */
export interface OrganizerPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Repositorio para la entidad Organizador
 */
export interface OrganizerRepository extends Repository<Organizer, string> {
  /**
   * Busca un organizador por ID de usuario
   * @param userId ID del usuario
   * @returns Organizador encontrado o null
   */
  findByUserId(userId: string): Promise<Organizer | null>;

  /**
   * Busca organizadores por nombre (búsqueda parcial)
   * @param name Nombre a buscar
   * @returns Lista de organizadores
   */
  findByName(name: string): Promise<Organizer[]>;

  /**
   * Busca organizadores verificados
   * @returns Lista de organizadores verificados
   */
  findVerified(): Promise<Organizer[]>;

  /**
   * Obtiene los organizadores mejor valorados
   * @param limit Número máximo de resultados
   * @returns Lista de organizadores
   */
  findTopRated(limit: number): Promise<Organizer[]>;

  /**
   * Obtiene los organizadores con más eventos
   * @param limit Número máximo de resultados
   * @returns Lista de organizadores
   */
  findMostActive(limit: number): Promise<Organizer[]>;
  
  /**
   * Obtiene los organizadores recientes
   * @param limit Número máximo de resultados
   * @returns Lista de organizadores
   */
  findRecent(limit: number): Promise<Organizer[]>;

  /**
   * Actualiza la calificación de un organizador
   * @param id ID del organizador
   * @param rating Nueva calificación
   */
  updateRating(id: string, rating: number): Promise<void>;

  /**
   * Incrementa el contador de eventos de un organizador
   * @param id ID del organizador
   */
  incrementEventCount(id: string): Promise<void>;

  /**
   * Decrementa el contador de eventos de un organizador
   * @param id ID del organizador
   */
  decrementEventCount(id: string): Promise<void>;

  /**
   * Verifica un organizador
   * @param id ID del organizador
   * @param verified Estado de verificación
   */
  verify(id: string, verified: boolean): Promise<void>;
} 