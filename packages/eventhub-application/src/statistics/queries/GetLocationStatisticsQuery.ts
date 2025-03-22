import { LocationStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

export class GetLocationStatisticsQuery implements Query<number | undefined, LocationStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas de ubicaciones
   */
  async execute(limit?: number): Promise<LocationStatisticsDTO> {
    if (limit !== undefined && limit <= 0) {
      throw new Error('El límite debe ser mayor a 0');
    }

    return this.statisticsRepository.getLocationStatistics(limit);
  }
} 