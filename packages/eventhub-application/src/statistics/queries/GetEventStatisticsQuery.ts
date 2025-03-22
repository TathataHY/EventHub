import { EventStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

export class GetEventStatisticsQuery implements Query<string, EventStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas de un evento
   */
  async execute(eventId: string): Promise<EventStatisticsDTO> {
    if (!eventId) {
      throw new Error('El ID del evento es requerido');
    }

    return this.statisticsRepository.getEventStatistics(eventId);
  }
} 