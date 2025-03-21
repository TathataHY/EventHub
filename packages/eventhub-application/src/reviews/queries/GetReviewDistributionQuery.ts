import { Query } from '../../core/interfaces/Query';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';
import { ReviewDistributionDTO } from '../dtos/ReviewDistributionDTO';
import { ReviewDistributionMapper } from '../mappers/ReviewDistributionMapper';

/**
 * Query para obtener la distribución estadística de las reseñas de un evento
 */
export class GetReviewDistributionQuery implements Query<string, ReviewDistributionDTO> {
  constructor(
    private readonly eventId: string,
    private readonly reviewRepository: ReviewRepositoryAdapter,
    private readonly reviewDistributionMapper: ReviewDistributionMapper
  ) {}

  /**
   * Ejecuta la consulta para obtener la distribución de reseñas
   * @param eventId ID del evento opcional (sobrescribe el constructor)
   * @returns Distribución de reseñas
   */
  async execute(eventId?: string): Promise<ReviewDistributionDTO> {
    const targetEventId = eventId || this.eventId;
    
    if (!targetEventId) {
      throw new Error('Se requiere un ID de evento para obtener la distribución de reseñas');
    }
    
    // Obtener estadísticas del repositorio
    const distribution = await this.reviewRepository.getEventReviewStats(targetEventId);
    
    // Transformar al DTO
    return this.reviewDistributionMapper.toDTO(distribution);
  }
} 