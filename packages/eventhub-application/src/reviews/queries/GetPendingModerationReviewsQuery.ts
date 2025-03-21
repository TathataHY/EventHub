import { Query } from '../../core/interfaces/Query';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';

/**
 * Opciones de paginación para la búsqueda de reseñas pendientes de moderación
 */
export interface PendingReviewsOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'score';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Resultado paginado de reseñas pendientes de moderación
 */
export interface PendingReviewsResult {
  reviews: ReviewDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Query para obtener las reseñas pendientes de moderación
 */
export class GetPendingModerationReviewsQuery implements Query<PendingReviewsOptions, PendingReviewsResult> {
  constructor(
    private readonly reviewRepository: ReviewRepositoryAdapter,
    private readonly reviewMapper: ReviewMapper
  ) {}

  /**
   * Ejecuta la consulta para obtener reseñas pendientes de moderación
   * @param options Opciones de paginación y ordenamiento
   * @returns Resultado paginado con las reseñas pendientes
   */
  async execute(options?: PendingReviewsOptions): Promise<PendingReviewsResult> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';
    
    // Configurar opciones para el repositorio
    const paginationOptions = {
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    // Obtener reseñas pendientes de moderación
    const result = await this.reviewRepository.findPendingModeration(paginationOptions);
    
    // Transformar a DTOs
    const reviews = result.reviews.map(review => this.reviewMapper.toDTO(review));
    
    return {
      reviews,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }
} 