import { SystemStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

export class GetSystemStatisticsQuery implements Query<void, SystemStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas generales del sistema
   */
  async execute(): Promise<SystemStatisticsDTO> {
    return this.statisticsRepository.getSystemStatistics();
  }
} 