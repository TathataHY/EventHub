import { Query } from '../../core/interfaces/Query';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Query para obtener una reseña por su ID
 */
export class GetReviewQuery implements Query<string, ReviewDTO | null> {
  constructor(
    private reviewRepository: ReviewRepositoryAdapter,
    private reviewMapper: ReviewMapper,
    private reviewId: string
  ) {}

  async execute(reviewId?: string): Promise<ReviewDTO | null> {
    const targetReviewId = reviewId || this.reviewId;
    
    if (!targetReviewId) {
      throw new Error('Se requiere un ID de reseña');
    }
    
    // Obtener la reseña del repositorio
    const review = await this.reviewRepository.findById(targetReviewId);
    
    if (!review) {
      return null;
    }
    
    // Transformar a DTO y devolver
    return this.reviewMapper.toDTO(review);
  }
} 