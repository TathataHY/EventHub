import { Repository } from '../../core/repositories/Repository';
import { Review } from '../entities/Review';

/**
 * Filtros para la búsqueda de reseñas
 * 
 * Define los criterios que se pueden utilizar para filtrar
 * reseñas en consultas al repositorio.
 */
export interface ReviewFilters {
  /** Filtrar por ID del evento */
  eventId?: string;
  
  /** Filtrar por ID del usuario */
  userId?: string;
  
  /** Filtrar por rango mínimo de puntuación */
  minScore?: number;
  
  /** Filtrar por rango máximo de puntuación */
  maxScore?: number;
  
  /** Filtrar solo reseñas activas/inactivas */
  isActive?: boolean;
  
  /** Filtrar solo reseñas verificadas/no verificadas */
  isVerified?: boolean;
  
  /** Filtrar por presencia de contenido textual */
  hasContent?: boolean;
  
  /** Filtrar por rango de fecha desde */
  fromDate?: Date;
  
  /** Filtrar por rango de fecha hasta */
  toDate?: Date;
}

/**
 * Opciones de paginación para consultas
 * 
 * Permite controlar cómo se paginan y ordenan los resultados
 * al consultar colecciones de reseñas.
 */
export interface PaginationOptions {
  /** Número de página (empieza en 1) */
  page?: number;
  
  /** Elementos por página */
  limit?: number;
  
  /** Campo por el que ordenar */
  sortBy?: 'createdAt' | 'updatedAt' | 'score';
  
  /** Dirección de ordenamiento */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Distribución estadística de puntuaciones
 * 
 * Representa la distribución de las puntuaciones de las reseñas
 * para un evento específico, útil para análisis y visualizaciones.
 */
export interface ReviewDistribution {
  /** Total de reseñas */
  total: number;
  
  /** Puntuación promedio */
  average: number;
  
  /** Distribución por cada puntuación posible */
  distribution: {
    /** Número de reseñas con puntuación 1 */
    '1': number;
    /** Número de reseñas con puntuación 2 */
    '2': number;
    /** Número de reseñas con puntuación 3 */
    '3': number;
    /** Número de reseñas con puntuación 4 */
    '4': number;
    /** Número de reseñas con puntuación 5 */
    '5': number;
  };
}

/**
 * Interfaz del repositorio de reseñas
 * 
 * Define todos los métodos necesarios para gestionar la persistencia
 * y recuperación de reseñas en el sistema. Proporciona operaciones
 * específicas para búsquedas, filtrado, estadísticas y gestión
 * de reseñas según distintos criterios.
 * 
 * Este repositorio es fundamental para el sistema de valoración
 * y comentarios de eventos, permitiendo a los usuarios compartir
 * sus experiencias y a los organizadores recibir retroalimentación.
 * 
 * @extends {Repository<string, Review>} Extiende el repositorio base con ID de tipo string
 */
export interface ReviewRepository extends Repository<string, Review> {
  /**
   * Encuentra reseñas aplicando filtros y paginación
   * 
   * Método general y flexible para buscar reseñas con múltiples
   * criterios combinados y controlar la presentación de resultados.
   * 
   * @param filters Criterios de filtrado para refinar la búsqueda
   * @param options Opciones de paginación y ordenamiento (opcional)
   * @returns Objeto con la lista de reseñas y el total encontrado
   * 
   * @example
   * // Buscar reseñas con puntuación alta para un evento
   * const result = await reviewRepository.findWithFilters({
   *   eventId: 'event-123',
   *   minScore: 4,
   *   isActive: true
   * }, { 
   *   page: 1, 
   *   limit: 10,
   *   sortBy: 'createdAt',
   *   sortOrder: 'desc'
   * });
   * console.log(`Encontradas ${result.total} reseñas`);
   */
  findWithFilters(
    filters: ReviewFilters,
    options?: PaginationOptions
  ): Promise<{ reviews: Review[]; total: number }>;

  /**
   * Busca todas las reseñas asociadas a un evento específico
   * 
   * Útil para mostrar todas las opiniones sobre un evento particular,
   * permitiendo a los usuarios ver la experiencia de otros asistentes.
   * 
   * @param eventId ID del evento a consultar
   * @returns Lista completa de reseñas para el evento especificado
   * 
   * @example
   * // Obtener todas las reseñas de un evento
   * const eventReviews = await reviewRepository.findByEventId('event-123');
   */
  findByEventId(eventId: string): Promise<Review[]>;

  /**
   * Busca todas las reseñas creadas por un usuario específico
   * 
   * Permite ver el historial de reseñas de un usuario, útil para
   * perfiles de usuario o para moderar la actividad de crítica.
   * 
   * @param userId ID del usuario autor de las reseñas
   * @returns Lista de todas las reseñas escritas por el usuario
   * 
   * @example
   * // Obtener el historial de reseñas de un usuario
   * const userReviews = await reviewRepository.findByUserId('user-456');
   */
  findByUserId(userId: string): Promise<Review[]>;

  /**
   * Verifica si un usuario ya ha reseñado un evento específico
   * 
   * Útil para controlar que cada usuario solo pueda crear una
   * reseña por evento asistido.
   * 
   * @param userId ID del usuario a verificar
   * @param eventId ID del evento a verificar
   * @returns true si el usuario ya ha reseñado el evento, false en caso contrario
   * 
   * @example
   * // Verificar si el usuario ya ha dejado una reseña
   * const hasReviewed = await reviewRepository.hasUserReviewedEvent('user-456', 'event-123');
   * if (hasReviewed) {
   *   console.log('El usuario ya ha reseñado este evento');
   * }
   */
  hasUserReviewedEvent(userId: string, eventId: string): Promise<boolean>;

  /**
   * Obtiene estadísticas de las reseñas para un evento específico
   * 
   * Proporciona un resumen de cómo ha sido evaluado un evento,
   * incluyendo la puntuación promedio y la distribución de las
   * calificaciones. Útil para mostrar la satisfacción general
   * de los asistentes.
   * 
   * @param eventId ID del evento a analizar
   * @returns Distribución estadística de las puntuaciones
   * 
   * @example
   * // Obtener estadísticas de reseñas de un evento
   * const stats = await reviewRepository.getEventReviewStats('event-123');
   * console.log(`Puntuación promedio: ${stats.average}`);
   * console.log(`Total de reseñas: ${stats.total}`);
   */
  getEventReviewStats(eventId: string): Promise<ReviewDistribution>;

  /**
   * Encuentra las reseñas verificadas más recientes
   * 
   * Recupera un conjunto de reseñas verificadas y ordenadas por
   * fecha de creación, útil para mostrar testimonios destacados
   * en la página principal o en secciones promocionales.
   * 
   * @param limit Número máximo de reseñas a recuperar
   * @returns Lista de reseñas verificadas ordenadas por fecha
   * 
   * @example
   * // Obtener las 5 reseñas verificadas más recientes para mostrar como testimonios
   * const testimonials = await reviewRepository.findRecentVerified(5);
   */
  findRecentVerified(limit: number): Promise<Review[]>;

  /**
   * Busca reseñas que requieren moderación
   * 
   * Encuentra reseñas activas no verificadas, para que los
   * moderadores puedan revisarlas y aprobarlas o desactivarlas
   * según corresponda.
   * 
   * @param options Opciones de paginación para los resultados
   * @returns Reseñas pendientes de moderación con información de paginación
   * 
   * @example
   * // Obtener la primera página de reseñas pendientes de moderación
   * const pendingReviews = await reviewRepository.findPendingModeration({
   *   page: 1,
   *   limit: 20
   * });
   */
  findPendingModeration(options: PaginationOptions): Promise<{ reviews: Review[]; total: number }>;
} 