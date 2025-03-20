import { Repository } from '../../../core/interfaces/Repository';
import { Review } from '../entities/Review';

/**
 * Opciones para filtrar reseñas
 */
export interface ReviewFilters {
  /**
   * ID del evento
   */
  eventId?: string;

  /**
   * ID del usuario
   */
  userId?: string;

  /**
   * Calificación mínima (1-5)
   */
  minScore?: number;

  /**
   * Calificación máxima (1-5)
   */
  maxScore?: number;

  /**
   * Solo reseñas con contenido
   */
  withContent?: boolean;

  /**
   * Solo reseñas verificadas
   */
  verified?: boolean;

  /**
   * Término de búsqueda para el contenido
   */
  query?: string;
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
  orderBy?: 'score' | 'createdAt';

  /**
   * Dirección del ordenamiento
   */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Distribución de reseñas por puntuación
 */
export interface ReviewDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  total: number;
  average: number;
}

/**
 * Interfaz del repositorio de reseñas
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para reseñas
 */
export interface ReviewRepository extends Repository<Review, string> {
  /**
   * Encuentra reseñas con filtros y paginación
   * @param filters Filtros para la búsqueda
   * @param options Opciones de paginación
   * @returns Lista de reseñas y total
   */
  findWithFilters(
    filters: ReviewFilters,
    options?: PaginationOptions
  ): Promise<{ reviews: Review[]; total: number }>;

  /**
   * Busca reseñas por ID de evento
   * @param eventId ID del evento
   * @returns Lista de reseñas del evento
   */
  findByEventId(eventId: string): Promise<Review[]>;

  /**
   * Busca reseñas por ID de usuario
   * @param userId ID del usuario
   * @returns Lista de reseñas del usuario
   */
  findByUserId(userId: string): Promise<Review[]>;

  /**
   * Busca una reseña por ID de evento y usuario
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Reseña del usuario para el evento o null si no existe
   */
  findByEventIdAndUserId(eventId: string, userId: string): Promise<Review | null>;

  /**
   * Busca reseñas por rango de calificación
   * @param minScore Calificación mínima
   * @param maxScore Calificación máxima
   * @returns Lista de reseñas en el rango especificado
   */
  findByScoreRange(minScore: number, maxScore: number): Promise<Review[]>;

  /**
   * Busca reseñas de un evento con opciones de filtrado y paginación
   * @param eventId ID del evento
   * @param options Opciones de filtrado y paginación
   * @returns Lista de reseñas y el total
   */
  findByEventIdWithOptions(
    eventId: string, 
    options: PaginationOptions
  ): Promise<{ reviews: Review[]; total: number }>;

  /**
   * Calcula la calificación promedio de un evento
   * @param eventId ID del evento
   * @returns Calificación promedio del evento
   */
  getAverageScore(eventId: string): Promise<number>;

  /**
   * Obtiene el conteo de reseñas por puntuación para un evento
   * @param eventId ID del evento
   * @returns Objeto con la distribución de calificaciones
   */
  getScoreDistribution(eventId: string): Promise<ReviewDistribution>;

  /**
   * Verifica una reseña
   * @param id ID de la reseña
   * @returns Reseña verificada o null si no existe
   */
  verifyReview(id: string): Promise<Review | null>;

  /**
   * Busca reseñas verificadas para un evento
   * @param eventId ID del evento
   * @returns Lista de reseñas verificadas
   */
  findVerifiedByEventId(eventId: string): Promise<Review[]>;

  /**
   * Busca reseñas por término de búsqueda en el contenido
   * @param query Término de búsqueda
   * @returns Lista de reseñas que contienen el término
   */
  searchByContent(query: string): Promise<Review[]>;

  /**
   * Cuenta el número de reseñas de un evento
   * @param eventId ID del evento
   * @param withContent Solo contar reseñas con contenido
   * @returns Número total de reseñas del evento
   */
  countByEventId(eventId: string, withContent?: boolean): Promise<number>;
} 