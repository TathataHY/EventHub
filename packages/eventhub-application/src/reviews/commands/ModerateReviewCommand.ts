import { Command } from '../../core/interfaces/Command';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ReviewDTO } from '../dtos/ReviewDTO';

/**
 * Tipo de acción de moderación
 */
export type ModerateAction = 'approve' | 'reject' | 'flag';

/**
 * Parámetros para el comando de moderación
 */
export interface ModerateReviewParams {
  reviewId: string;
  moderatorId: string;
  action: ModerateAction;
  reason?: string;
}

/**
 * Comando para moderar una reseña (aprobar, rechazar o marcar como inapropiada)
 */
export class ModerateReviewCommand implements Command<ModerateReviewParams, ReviewDTO> {
  private reviewId: string;
  private moderatorId: string;
  private action: ModerateAction;
  private reason?: string;
  
  constructor(
    private readonly reviewRepository: ReviewRepositoryAdapter,
    private readonly reviewMapper: ReviewMapper
  ) {}
  
  /**
   * Configura los parámetros para el comando
   */
  setParams(params: ModerateReviewParams): ModerateReviewCommand {
    this.reviewId = params.reviewId;
    this.moderatorId = params.moderatorId;
    this.action = params.action;
    this.reason = params.reason;
    return this;
  }

  /**
   * Ejecuta el comando de moderación de reseña
   * @param params Parámetros de moderación
   * @returns La reseña moderada
   */
  async execute(params?: ModerateReviewParams): Promise<ReviewDTO> {
    // Usar los parámetros proporcionados o los configurados previamente
    const reviewId = params?.reviewId || this.reviewId;
    const moderatorId = params?.moderatorId || this.moderatorId;
    const action = params?.action || this.action;
    const reason = params?.reason || this.reason;
    
    if (!reviewId || !moderatorId || !action) {
      throw new Error('Faltan parámetros requeridos para moderar la reseña');
    }
    
    // Obtener la reseña
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('La reseña no existe');
    }
    
    // Aplicar la acción de moderación
    switch (action) {
      case 'approve':
        if (review.isVerified) {
          throw new Error('La reseña ya está aprobada');
        }
        review.isVerified = true;
        break;
        
      case 'reject':
        // Rechazar implica desactivar la reseña
        review.isActive = false;
        review.moderationReason = reason || 'Rechazada por moderador';
        break;
        
      case 'flag':
        // Marcar como inapropiada
        review.isFlagged = true;
        review.moderationReason = reason || 'Marcada como inapropiada';
        break;
        
      default:
        throw new Error('Acción de moderación no válida');
    }
    
    // Registrar quién y cuándo realizó la moderación
    review.moderatedBy = moderatorId;
    review.moderatedAt = new Date();
    review.updatedAt = new Date();
    
    // Guardar los cambios
    await this.reviewRepository.save(review);
    
    // Devolver la reseña moderada
    return this.reviewMapper.toDTO(review);
  }
} 