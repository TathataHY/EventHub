import { Command } from '../../core/interfaces/Command';
import { UpdateReviewDTO } from '../dtos/UpdateReviewDTO';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Parámetros para actualizar una reseña
 */
interface UpdateReviewParams {
  reviewId: string;
  userId: string;
  data: UpdateReviewDTO;
}

/**
 * Comando para actualizar una reseña existente
 */
export class UpdateReviewCommand implements Command<UpdateReviewParams, ReviewDTO> {
  constructor(
    private reviewRepository: ReviewRepositoryAdapter,
    private reviewMapper: ReviewMapper,
    private reviewId: string,
    private userId: string,
    private reviewData: UpdateReviewDTO
  ) {}

  async execute(params?: UpdateReviewParams): Promise<ReviewDTO> {
    // Usar parámetros o datos del constructor
    const reviewId = params?.reviewId || this.reviewId;
    const userId = params?.userId || this.userId;
    const reviewData = params?.data || this.reviewData;
    
    if (!reviewId || !userId || !reviewData) {
      throw new Error('Faltan datos requeridos para actualizar la reseña');
    }
    
    // Obtener la reseña existente
    const existingReview = await this.reviewRepository.findById(reviewId);
    
    if (!existingReview) {
      throw new ValidationException('La reseña no existe');
    }
    
    // Verificar que el usuario sea el propietario de la reseña
    if (existingReview.userId !== userId) {
      throw new ValidationException('No tienes permiso para editar esta reseña');
    }
    
    // Validar los nuevos datos
    this.validateReviewData(reviewData);
    
    // Crear una versión actualizada de la reseña
    const updatedReviewData = {
      ...existingReview,
      score: reviewData.score !== undefined ? reviewData.score : existingReview.score,
      content: reviewData.content !== undefined ? reviewData.content : existingReview.content,
      updatedAt: new Date()
    };
    
    // Convertir a formato de dominio y guardar
    const updatedReview = this.reviewMapper.toDomain(updatedReviewData);
    await this.reviewRepository.save(updatedReview);
    
    // Devolver la reseña actualizada como DTO
    return this.reviewMapper.toDTO(updatedReviewData);
  }
  
  private validateReviewData(data: UpdateReviewDTO): void {
    if (data.score !== undefined && (data.score < 1 || data.score > 5)) {
      throw new ValidationException('La calificación debe estar entre 1 y 5');
    }
    
    if (data.content !== undefined) {
      if (data.content.trim().length === 0) {
        throw new ValidationException('El comentario no puede estar vacío');
      }
      
      if (data.content.length > 1000) {
        throw new ValidationException('El comentario no puede exceder los 1000 caracteres');
      }
    }
  }
} 