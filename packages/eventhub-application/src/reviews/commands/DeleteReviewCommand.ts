import { Command } from '../../core/interfaces/Command';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Comando para eliminar una reseña
 */
export class DeleteReviewCommand implements Command<string, void> {
  constructor(
    private reviewRepository: ReviewRepositoryAdapter,
    private reviewId: string,
    private userId?: string
  ) {}

  async execute(reviewId?: string): Promise<void> {
    const targetReviewId = reviewId || this.reviewId;
    
    if (!targetReviewId) {
      throw new Error('Se requiere un ID de reseña para eliminarla');
    }
    
    // Recuperar la reseña para validaciones
    const existingReview = await this.reviewRepository.findById(targetReviewId);
    
    if (!existingReview) {
      throw new ValidationException('La reseña no existe');
    }
    
    // Verificar que el usuario sea propietario de la reseña si se proporciona userId
    if (this.userId && existingReview.userId !== this.userId) {
      throw new ValidationException('No tienes permiso para eliminar esta reseña');
    }
    
    // Eliminar la reseña
    await this.reviewRepository.delete(targetReviewId);
  }
} 