import { UserStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

export class GetUserStatisticsQuery implements Query<string, UserStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas de un usuario
   */
  async execute(userId: string): Promise<UserStatisticsDTO> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    return this.statisticsRepository.getUserStatistics(userId);
  }
} 