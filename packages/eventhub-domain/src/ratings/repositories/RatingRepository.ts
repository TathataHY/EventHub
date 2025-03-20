import { Repository } from '../../../core/interfaces/Repository';
import { Rating } from '../entities/Rating';

/**
 * Opciones para filtrar calificaciones
 */
export interface FindRatingsOptions {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'createdAt' | 'score';
}

/**
 * Distribución de calificaciones por puntuación
 */
export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  total: number;
}

/**
 * Interfaz del repositorio de calificaciones
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para calificaciones
 */
export interface RatingRepository extends Repository<Rating, string> {
  /**
   * Busca calificaciones por ID de evento
   * @param eventId ID del evento
   * @returns Lista de calificaciones del evento
   */
  findByEventId(eventId: string): Promise<Rating[]>;

  /**
   * Busca calificaciones por ID de usuario
   * @param userId ID del usuario
   * @returns Lista de calificaciones del usuario
   */
  findByUserId(userId: string): Promise<Rating[]>;

  /**
   * Busca una calificación por ID de evento y usuario
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Calificación del usuario para el evento o null si no existe
   */
  findByEventIdAndUserId(eventId: string, userId: string): Promise<Rating | null>;

  /**
   * Busca calificaciones de un evento con opciones de filtrado y paginación
   * @param eventId ID del evento
   * @param options Opciones de filtrado y paginación
   * @returns Lista de calificaciones y el total
   */
  findByEventIdWithOptions(eventId: string, options: FindRatingsOptions): Promise<{ ratings: Rating[], total: number }>;

  /**
   * Calcula la calificación promedio de un evento
   * @param eventId ID del evento
   * @returns Calificación promedio del evento
   */
  getAverageRating(eventId: string): Promise<number>;

  /**
   * Obtiene el conteo de calificaciones por puntuación para un evento
   * @param eventId ID del evento
   * @returns Objeto con el conteo de calificaciones por puntuación
   */
  getRatingDistribution(eventId: string): Promise<RatingDistribution>;
} 