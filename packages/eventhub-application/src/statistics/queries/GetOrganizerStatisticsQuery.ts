import { OrganizerStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

export class GetOrganizerStatisticsQuery implements Query<string, OrganizerStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas de un organizador
   */
  async execute(organizerId: string): Promise<OrganizerStatisticsDTO> {
    if (!organizerId) {
      throw new Error('El ID del organizador es requerido');
    }

    return this.statisticsRepository.getOrganizerStatistics(organizerId);
  }
} 