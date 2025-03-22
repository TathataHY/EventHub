import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions';
import { PaymentRepository } from '@eventhub/domain/dist/payments/repositories/PaymentRepository';

/**
 * Interfaz para resultados por evento
 */
interface EventSummary {
  id: string;
  title: string;
  date: string;
  attendeesCount: number;
  ticketsSold: number;
  revenue: number;
}

/**
 * Modelo del resultado del dashboard de organizador
 */
export interface OrganizerDashboardResult {
  organizerId: string;
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  currency: string;
  eventsByMonth: {
    month: string;
    count: number;
  }[];
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
  topEvents: EventSummary[];
  recentEvents: EventSummary[];
}

/**
 * Query para obtener el dashboard de un organizador
 */
export class GetOrganizerDashboardQuery implements Query<OrganizerDashboardResult> {
  constructor(
    private readonly organizerId: string,
    private readonly eventRepository: EventRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly limit: number = 5,
    private readonly period: string = 'year'
  ) {}

  /**
   * Ejecuta la consulta para obtener el dashboard de un organizador
   * @returns Promise<OrganizerDashboardResult> Datos del dashboard del organizador
   * @throws NotFoundException si el organizador no existe o no tiene eventos
   */
  async execute(): Promise<OrganizerDashboardResult> {
    // Obtener eventos del organizador
    const organizerEvents = await this.eventRepository.findByOrganizerId(this.organizerId);
    
    if (!organizerEvents || organizerEvents.length === 0) {
      throw new NotFoundException('Eventos del organizador', this.organizerId);
    }

    // Obtener la fecha actual para filtrar eventos pasados y futuros
    const now = new Date();
    
    // Filtrar eventos pasados y futuros
    const pastEvents = organizerEvents.filter(event => new Date(event.startDate) < now);
    const upcomingEvents = organizerEvents.filter(event => new Date(event.startDate) >= now);
    
    // Calcular total de asistentes en todos los eventos
    const totalAttendees = organizerEvents.reduce((sum, event) => sum + (event.attendees?.length || 0), 0);
    
    // Obtener pagos de todos los eventos del organizador
    const eventIds = organizerEvents.map(event => event.id);
    const allPayments = await this.getPaymentsForEvents(eventIds);
    
    // Calcular ingresos totales
    const completedPayments = allPayments.filter(payment => payment.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Determinar la moneda (asumiendo que todos los pagos usan la misma moneda)
    const currency = completedPayments.length > 0 ? completedPayments[0].currency : 'EUR';
    
    // Calcular eventos por mes
    const eventsByMonth = this.calculateEventsByMonth(organizerEvents);
    
    // Calcular ingresos por mes
    const revenueByMonth = this.calculateRevenueByMonth(completedPayments);
    
    // Obtener los eventos más exitosos (basado en asistentes o ingresos)
    const topEvents = this.getTopEvents(organizerEvents, allPayments);
    
    // Obtener eventos recientes
    const recentEvents = this.getRecentEvents(organizerEvents);

    return {
      organizerId: this.organizerId,
      totalEvents: organizerEvents.length,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
      totalAttendees,
      totalRevenue,
      currency,
      eventsByMonth,
      revenueByMonth,
      topEvents,
      recentEvents
    };
  }

  /**
   * Obtiene pagos para múltiples eventos
   */
  private async getPaymentsForEvents(eventIds: string[]): Promise<any[]> {
    // Implementación básica - en un caso real, el repositorio tendría un método para esto
    const paymentsPromises = eventIds.map(eventId => 
      this.paymentRepository.findByEventId(eventId)
    );
    
    const paymentsArrays = await Promise.all(paymentsPromises);
    return paymentsArrays.flat();
  }

  /**
   * Calcula eventos por mes
   */
  private calculateEventsByMonth(events: any[]): { month: string; count: number }[] {
    const monthCounts = new Map<string, number>();
    
    events.forEach(event => {
      const date = new Date(event.startDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    });
    
    return Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Calcula ingresos por mes
   */
  private calculateRevenueByMonth(payments: any[]): { month: string; amount: number }[] {
    const monthlyRevenue = new Map<string, number>();
    
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + payment.amount);
    });
    
    return Array.from(monthlyRevenue.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Obtiene los eventos más exitosos
   */
  private getTopEvents(events: any[], payments: any[]): EventSummary[] {
    // Agrupar pagos por evento
    const paymentsByEvent = payments.reduce((acc, payment) => {
      if (!acc[payment.eventId]) {
        acc[payment.eventId] = [];
      }
      acc[payment.eventId].push(payment);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Calcular ingresos por evento
    const eventRevenues = Object.entries(paymentsByEvent).map(([eventId, eventPayments]) => {
      const completedPayments = eventPayments.filter(p => p.status === 'completed');
      const revenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
      const ticketsSold = completedPayments.length;
      return { eventId, revenue, ticketsSold };
    });
    
    // Ordenar eventos por ingresos
    eventRevenues.sort((a, b) => b.revenue - a.revenue);
    
    // Limitar al número especificado y formatear resultado
    return eventRevenues
      .slice(0, this.limit)
      .map(({ eventId, revenue, ticketsSold }) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return null;
        
        return {
          id: event.id,
          title: event.title,
          date: new Date(event.startDate).toISOString().split('T')[0],
          attendeesCount: event.attendees?.length || 0,
          ticketsSold,
          revenue
        };
      })
      .filter(Boolean) as EventSummary[];
  }

  /**
   * Obtiene los eventos más recientes
   */
  private getRecentEvents(events: any[]): EventSummary[] {
    return [...events]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, this.limit)
      .map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.startDate).toISOString().split('T')[0],
        attendeesCount: event.attendees?.length || 0,
        ticketsSold: 0, // Se calcularía con datos reales
        revenue: 0 // Se calcularía con datos reales
      }));
  }
} 