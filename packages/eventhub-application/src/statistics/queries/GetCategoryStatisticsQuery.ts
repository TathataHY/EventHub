import { CategoryStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

export class GetCategoryStatisticsQuery implements Query<number | undefined, CategoryStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas de categorías
   */
  async execute(limit?: number): Promise<CategoryStatisticsDTO> {
    if (limit !== undefined && limit <= 0) {
      throw new Error('El límite debe ser mayor a 0');
    }

    return this.statisticsRepository.getCategoryStatistics(limit);
  }
} 