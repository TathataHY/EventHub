import { Query } from '../../core/interfaces/Query';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ReviewDTO } from '../dtos/ReviewDTO';

/**
 * Query para obtener todas las reseñas de un evento
 */
export class GetEventReviewsQuery implements Query<string, ReviewDTO[]> {
  constructor(
    private readonly eventId: string,
    private readonly reviewRepository: ReviewRepositoryAdapter,
    private readonly reviewMapper: ReviewMapper
  ) {}

  /**
   * Ejecuta la consulta para obtener las reseñas de un evento
   * @param eventId ID del evento opcional (sobrescribe el constructor)
   * @returns Lista de reseñas del evento
   */
  async execute(eventId?: string): Promise<ReviewDTO[]> {
    const targetEventId = eventId || this.eventId;
    
    if (!targetEventId) {
      throw new Error('Se requiere un ID de evento para obtener las reseñas');
    }
    
    // Obtener reseñas del evento
    const reviews = await this.reviewRepository.findByEventId(targetEventId);
    
    // Transformar a DTOs
    return reviews.map(review => this.reviewMapper.toDTO(review));
  }
} 