import { Query } from '../../core/interfaces/Query';
import { ValidationException, NotFoundException } from '../../core/exceptions';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { ReviewDistribution } from '@eventhub/domain/dist/reviews/value-objects/ReviewDistribution';
import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';

/**
 * Consulta para obtener estadísticas de reseñas de un evento
 */
export class GetEventReviewStatsQuery implements Query<ReviewDistribution> {
  constructor(
    private readonly eventId: string,
    private readonly reviewRepository: ReviewRepository,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta la consulta para obtener estadísticas de reseñas de un evento
   * @returns Promise<ReviewDistribution> Estadísticas de las reseñas
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el evento no existe
   */
  async execute(): Promise<ReviewDistribution> {
    // Validación
    if (!this.eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    // Verificar que el evento existe
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException(`No se encontró el evento con ID ${this.eventId}`);
    }

    // Obtener estadísticas
    const stats = await this.reviewRepository.getEventReviewStats(this.eventId);
    
    return stats;
  }
} 