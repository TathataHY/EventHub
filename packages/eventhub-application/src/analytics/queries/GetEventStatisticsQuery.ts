import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions';
import { PaymentRepository } from '@eventhub/domain/dist/payments/repositories/PaymentRepository';

/**
 * Modelo del resultado de estadísticas de evento
 */
export interface EventStatisticsResult {
  eventId: string;
  title: string;
  attendeesCount: number;
  registrationsOverTime: {
    date: string;
    count: number;
  }[];
  ticketsSold: number;
  totalRevenue: number;
  currency: string;
  averageTicketPrice: number;
  conversionRate: number;
  geographicDistribution?: Record<string, number>;
  popularCategories?: Record<string, number>;
}

/**
 * Query para obtener estadísticas de un evento
 */
export class GetEventStatisticsQuery implements Query<EventStatisticsResult> {
  constructor(
    private readonly eventId: string,
    private readonly eventRepository: EventRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly period?: 'day' | 'week' | 'month' | 'year'
  ) {}

  /**
   * Ejecuta la consulta para obtener estadísticas de un evento
   * @returns Promise<EventStatisticsResult> Estadísticas del evento
   * @throws NotFoundException si el evento no existe
   */
  async execute(): Promise<EventStatisticsResult> {
    // Obtener el evento
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException('Evento', this.eventId);
    }

    // Obtener pagos relacionados con el evento
    const eventPayments = await this.paymentRepository.findByEventId(this.eventId);
    
    // Filtrar pagos completados
    const completedPayments = eventPayments.filter(payment => payment.status === 'completed');
    
    // Calcular ingresos totales
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calcular número de tickets vendidos
    const ticketsSold = completedPayments.length;
    
    // Calcular precio promedio de ticket
    const averageTicketPrice = ticketsSold > 0 ? totalRevenue / ticketsSold : 0;
    
    // Determinar la moneda (asumiendo que todos los pagos usan la misma moneda)
    const currency = completedPayments.length > 0 ? completedPayments[0].currency : 'EUR';
    
    // Calcular tasa de conversión (asistentes registrados vs pagos completados)
    const attendeesCount = event.attendees?.length || 0;
    const conversionRate = attendeesCount > 0 ? ticketsSold / attendeesCount : 0;

    // Agrupar registros de asistentes por fecha para análisis de tendencia
    const registrationsOverTime = this.calculateRegistrationsOverTime(event, this.period);
    
    // Recopilar distribución geográfica si está disponible
    const geographicDistribution = this.calculateGeographicDistribution(event);
    
    // Analizar categorías populares
    const popularCategories = this.calculatePopularCategories(event);

    return {
      eventId: event.id,
      title: event.title,
      attendeesCount,
      registrationsOverTime,
      ticketsSold,
      totalRevenue,
      currency,
      averageTicketPrice,
      conversionRate,
      geographicDistribution,
      popularCategories
    };
  }

  /**
   * Calcula la distribución de registros de asistentes a lo largo del tiempo
   */
  private calculateRegistrationsOverTime(event: any, period?: 'day' | 'week' | 'month' | 'year'): { date: string; count: number }[] {
    // Implementación básica - suponiendo que los asistentes tienen fechas de registro
    // En un caso real, esto sería implementado con datos reales y agrupación adecuada
    const registrationsMap = new Map<string, number>();
    
    // Formatear fechas según el periodo seleccionado
    const formatDate = (date: Date): string => {
      switch (period) {
        case 'day':
          return date.toISOString().split('T')[0]; // YYYY-MM-DD
        case 'week':
          const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
          return `${date.getFullYear()}-W${weekNumber}`;
        case 'month':
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        case 'year':
          return `${date.getFullYear()}`;
        default:
          return date.toISOString().split('T')[0]; // Default to day
      }
    };

    // Agrupar asistentes por fecha de registro
    if (event.attendees && Array.isArray(event.attendees)) {
      event.attendees.forEach((attendee: any) => {
        if (attendee.registeredAt) {
          const dateKey = formatDate(new Date(attendee.registeredAt));
          registrationsMap.set(dateKey, (registrationsMap.get(dateKey) || 0) + 1);
        }
      });
    }

    // Convertir mapa a array para resultado
    return Array.from(registrationsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Calcula la distribución geográfica de asistentes
   */
  private calculateGeographicDistribution(event: any): Record<string, number> | undefined {
    // Implementación básica - suponiendo que los asistentes tienen información de ubicación
    if (!event.attendees || !Array.isArray(event.attendees)) {
      return undefined;
    }

    const geoDistribution: Record<string, number> = {};
    
    event.attendees.forEach((attendee: any) => {
      if (attendee.location) {
        geoDistribution[attendee.location] = (geoDistribution[attendee.location] || 0) + 1;
      }
    });

    return Object.keys(geoDistribution).length > 0 ? geoDistribution : undefined;
  }

  /**
   * Calcula la popularidad de las categorías asociadas al evento
   */
  private calculatePopularCategories(event: any): Record<string, number> | undefined {
    // Implementación básica - categorías asociadas al evento
    if (!event.categoryIds || !Array.isArray(event.categoryIds) || event.categoryIds.length === 0) {
      return undefined;
    }

    const categoryCounts: Record<string, number> = {};
    
    // Asignar un valor fijo a cada categoría asociada
    // En un caso real, esto podría basarse en métricas de participación o interacción
    event.categoryIds.forEach((categoryId: string) => {
      categoryCounts[categoryId] = 1;
    });

    return Object.keys(categoryCounts).length > 0 ? categoryCounts : undefined;
  }
} 