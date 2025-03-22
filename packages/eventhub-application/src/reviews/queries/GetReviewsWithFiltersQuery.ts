import { Query } from '../../core/interfaces/Query';
import { ValidationException } from '../../core/exceptions';
import { ReviewRepository, ReviewFilters } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';

/**
 * Definición de opciones de paginación para reseñas
 */
export interface ReviewPaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'score';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interfaz para el resultado paginado
 */
export interface PaginatedReviews {
  items: ReviewDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Consulta para obtener reseñas con filtros avanzados y paginación
 */
export class GetReviewsWithFiltersQuery implements Query<PaginatedReviews> {
  constructor(
    private readonly filters: ReviewFilters,
    private readonly paginationOptions: ReviewPaginationOptions,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewMapper: ReviewMapper
  ) {}

  /**
   * Ejecuta la consulta para obtener reseñas con filtros avanzados
   * @returns Promise<PaginatedReviews> Lista paginada de reseñas
   * @throws ValidationException si hay problemas de validación
   */
  async execute(): Promise<PaginatedReviews> {
    // Validar opciones de paginación
    if (!this.paginationOptions) {
      throw new ValidationException('Las opciones de paginación son requeridas');
    }

    // Asegurar que los valores de paginación sean válidos
    const validPage = Math.max(1, this.paginationOptions.page || 1);
    const validLimit = Math.min(50, Math.max(1, this.paginationOptions.limit || 10)); // Limitar entre 1 y 50
    
    // Opciones de paginación
    const options: ReviewPaginationOptions = {
      page: validPage,
      limit: validLimit,
      sortBy: this.paginationOptions.sortBy || 'createdAt',
      sortOrder: this.paginationOptions.sortOrder || 'desc'
    };
    
    // Obtener reseñas con filtros
    const result = await this.reviewRepository.findWithFilters(this.filters, options);
    
    // Calcular total de páginas
    const totalPages = Math.ceil(result.total / validLimit);
    
    // Mapear a DTOs
    const items = result.reviews.map(review => this.reviewMapper.toDTO(review));
    
    return {
      items,
      total: result.total,
      page: validPage,
      limit: validLimit,
      totalPages
    };
  }
} 