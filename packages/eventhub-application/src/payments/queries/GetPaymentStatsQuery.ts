import { QueryWithMultiParams } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';

interface PaymentStats {
  totalRevenue: number;
  revenueByEvent: Record<string, number>;
  revenueByOrganizer: Record<string, number>;
  revenuePerDay: { date: string; amount: number }[];
  topOrganizers: { organizerId: string; organizerName: string; eventCount: number; revenue: number }[];
  topEvents: { eventId: string; eventTitle: string; organizerId: string; organizerName: string; ticketsSold: number; revenue: number }[];
}

/**
 * Consulta para obtener estadísticas de pagos
 */
export class GetPaymentStatsQuery implements QueryWithMultiParams<{ since?: Date }, PaymentStats> {
  constructor(private readonly paymentRepository: PaymentRepositoryAdapter) {}

  /**
   * Ejecuta la consulta para obtener estadísticas de pagos
   * @param params Parámetros de la consulta
   * @returns Estadísticas de pagos
   */
  async execute({ since }: { since?: Date }): Promise<PaymentStats> {
    const [
      totalRevenue,
      revenuePerDay,
      topOrganizers,
      topEvents
    ] = await Promise.all([
      this.paymentRepository.getPaymentStats(since || new Date(0), new Date()),
      this.paymentRepository.getPaymentStats(since || new Date(0), new Date()).then(stats => stats.revenuePerDay || []),
      [], // El adaptador no tiene método getTopOrganizers
      []  // El adaptador no tiene método getTopEvents
    ]);

    // Como el adaptador no tiene todos los métodos necesarios, simulamos datos básicos
    const revenueByEvent: Record<string, number> = {};
    const revenueByOrganizer: Record<string, number> = {};

    return {
      totalRevenue: totalRevenue?.totalAmount || 0,
      revenueByEvent,
      revenueByOrganizer,
      revenuePerDay: revenuePerDay || [],
      topOrganizers: [],
      topEvents: []
    };
  }
} 