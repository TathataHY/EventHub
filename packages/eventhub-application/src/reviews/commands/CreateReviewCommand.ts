import { Command } from '../../core/interfaces/Command';
import { CreateReviewDTO } from '../dtos/CreateReviewDTO';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Comando para crear una nueva reseña
 */
export class CreateReviewCommand implements Command<CreateReviewDTO, ReviewDTO> {
  constructor(
    private reviewRepository: ReviewRepositoryAdapter,
    private reviewMapper: ReviewMapper,
    private reviewData?: CreateReviewDTO
  ) {}

  async execute(params?: CreateReviewDTO): Promise<ReviewDTO> {
    const data = params || this.reviewData;
    
    if (!data) {
      throw new Error('Se requieren datos para crear la reseña');
    }
    
    await this.validateReviewData(data);
    
    // Verificar si el usuario ya ha dejado una reseña para este evento
    const hasReviewed = await this.reviewRepository.hasUserReviewedEvent(data.userId, data.eventId);
    
    if (hasReviewed) {
      throw new ValidationException('El usuario ya ha dejado una reseña para este evento');
    }
    
    // Crear la reseña en formato de dominio
    const review = this.reviewMapper.toDomain(data);
    
    // Guardar en el repositorio
    await this.reviewRepository.save(review);
    
    // Devolver la reseña creada como DTO
    return this.reviewMapper.toDTO(review);
  }

  private async validateReviewData(data: CreateReviewDTO): Promise<void> {
    if (!data.userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }

    if (!data.eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    if (data.score < 1 || data.score > 5) {
      throw new ValidationException('La calificación debe estar entre 1 y 5');
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new ValidationException('El comentario no puede estar vacío');
    }

    if (data.content.length > 1000) {
      throw new ValidationException('El comentario no puede exceder los 1000 caracteres');
    }
  }
} 