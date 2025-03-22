import { Query } from '../../core/interfaces/Query';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ReviewDTO } from '../dtos/ReviewDTO';

/**
 * Query para obtener todas las reseñas escritas por un usuario
 */
export class GetUserReviewsQuery implements Query<string, ReviewDTO[]> {
  constructor(
    private readonly userId: string,
    private readonly reviewRepository: ReviewRepositoryAdapter,
    private readonly reviewMapper: ReviewMapper
  ) {}

  /**
   * Ejecuta la consulta para obtener las reseñas de un usuario
   * @param userId ID del usuario opcional (sobrescribe el constructor)
   * @returns Lista de reseñas del usuario
   */
  async execute(userId?: string): Promise<ReviewDTO[]> {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      throw new Error('Se requiere un ID de usuario para obtener las reseñas');
    }
    
    // Obtener reseñas del usuario
    const reviews = await this.reviewRepository.findByUserId(targetUserId);
    
    // Transformar a DTOs
    return reviews.map(review => this.reviewMapper.toDTO(review));
  }
} 