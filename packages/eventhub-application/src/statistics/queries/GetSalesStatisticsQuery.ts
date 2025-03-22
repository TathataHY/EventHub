import { SalesStatisticsDTO } from '../dtos/StatisticsDTO';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';
import { Query } from '../../core/interfaces/Query';

interface GetSalesStatisticsParams {
  period: string;
  startDate?: Date;
  endDate?: Date;
}

export class GetSalesStatisticsQuery implements Query<GetSalesStatisticsParams, SalesStatisticsDTO> {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * Ejecuta la consulta para obtener las estadísticas de ventas
   */
  async execute({ period, startDate, endDate }: GetSalesStatisticsParams): Promise<SalesStatisticsDTO> {
    if (!period) {
      throw new Error('El período es requerido');
    }

    // Validar que el periodo sea válido
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(period)) {
      throw new Error('El período debe ser: daily, weekly, monthly o yearly');
    }

    // Validar fechas si se proporcionan
    if (startDate && endDate && startDate > endDate) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    return this.statisticsRepository.getSalesStatistics(period, startDate, endDate);
  }
} 