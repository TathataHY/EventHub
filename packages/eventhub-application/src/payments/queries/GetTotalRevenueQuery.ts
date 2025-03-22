import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { RevenueDTO } from '../dtos/RevenueDTO';
import { Currency } from '../../../src/shared/enums/Currency';

/**
 * Consulta para obtener estadísticas de ingresos
 * con opción para filtrar por período de tiempo
 */
export class GetTotalRevenueQuery implements Query<string | undefined, RevenueDTO> {
  constructor(private paymentRepository: PaymentRepositoryAdapter) {}

  /**
   * Ejecuta la consulta para obtener estadísticas de ingresos
   * @param timeframe Período de tiempo (daily, weekly, monthly, yearly, all)
   */
  async execute(timeframe?: string): Promise<RevenueDTO> {
    // Establecer período por defecto
    const period = timeframe || 'all';
    
    // Calcular rango de fechas basado en el período
    const { startDate, endDate } = this.calculateDateRange(period);
    
    // Obtener estadísticas de pagos
    const stats = await this.paymentRepository.getPaymentStats(startDate, endDate);
    
    // Construir el DTO de ingresos
    return {
      total: stats.totalAmount,
      currency: Currency.USD, // Moneda por defecto
      period,
      startDate,
      endDate,
      transactionCount: stats.totalCount,
      averageAmount: stats.averageAmount,
      revenueByTimeSegment: stats.revenueByPeriod
    };
  }
  
  /**
   * Calcula el rango de fechas basado en el período
   */
  private calculateDateRange(timeframe: string): { startDate: Date | undefined; endDate: Date | undefined } {
    const now = new Date();
    const endDate = new Date(now);
    let startDate: Date | undefined;
    
    switch (timeframe) {
      case 'daily':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
        
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
        
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
        
      case 'yearly':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
        
      case 'all':
      default:
        startDate = undefined;
        break;
    }
    
    return { startDate, endDate };
  }
} 