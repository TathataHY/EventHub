import { Query } from '../../core/interfaces/Query';
import { ValidationException } from '../../core/exceptions';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';

/**
 * Consulta para obtener reseñas verificadas recientes para mostrar como testimonios
 */
export class FindRecentVerifiedReviewsQuery implements Query<ReviewDTO[]> {
  constructor(
    private readonly limit: number,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewMapper: ReviewMapper
  ) {}

  /**
   * Ejecuta la consulta para obtener reseñas verificadas recientes
   * @returns Promise<ReviewDTO[]> Lista de reseñas verificadas
   * @throws ValidationException si hay problemas de validación
   */
  async execute(): Promise<ReviewDTO[]> {
    // Validación
    if (!this.limit || this.limit < 1) {
      throw new ValidationException('El límite debe ser un número positivo');
    }

    // Limitar a un máximo razonable
    const safeLimit = Math.min(this.limit, 20);

    // Obtener reseñas verificadas recientes
    const reviews = await this.reviewRepository.findRecentVerified(safeLimit);
    
    // Mapear a DTOs
    return reviews.map(review => this.reviewMapper.toDTO(review));
  }
} 