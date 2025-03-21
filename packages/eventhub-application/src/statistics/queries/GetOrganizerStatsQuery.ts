import { Query } from '../../core/interfaces/Query';
import { ValidationException, NotFoundException, UnauthorizedException } from '../../core/exceptions';
import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';

/**
 * Período de tiempo para obtener estadísticas
 */
export enum StatsPeriod {
  LAST_WEEK = 'last_week',
  LAST_MONTH = 'last_month',
  LAST_3_MONTHS = 'last_3_months',
  LAST_YEAR = 'last_year',
  ALL_TIME = 'all_time'
}

/**
 * Resultados de estadísticas de organizador
 */
export interface OrganizerStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  canceledEvents: number;
  totalAttendees: number;
  averageAttendeesPerEvent: number;
  totalTicketsSold: number;
  totalRevenue: number;
  revenueByEventType: Record<string, number>;
  eventsCreatedOverTime: {
    period: string;
    count: number;
  }[];
  attendanceRateOverTime: {
    period: string;
    rate: number;
  }[];
  mostPopularEvents: {
    id: string;
    name: string;
    attendees: number;
  }[];
}

/**
 * Consulta para obtener estadísticas de un organizador
 */
export class GetOrganizerStatsQuery implements Query<OrganizerStats> {
  constructor(
    private readonly organizerId: string,
    private readonly userId: string,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly period: StatsPeriod = StatsPeriod.ALL_TIME,
    private readonly isAdmin: boolean = false
  ) {}

  /**
   * Ejecuta la consulta para obtener estadísticas de un organizador
   * @returns Promise<OrganizerStats> Estadísticas del organizador
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el organizador no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<OrganizerStats> {
    // Validación básica
    if (!this.organizerId) {
      throw new ValidationException('ID de organizador es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    // Verificar que el organizador existe
    const organizer = await this.userRepository.findById(this.organizerId);
    if (!organizer) {
      throw new NotFoundException('Organizador', this.organizerId);
    }

    // Verificar permisos (sólo el propio organizador o admins)
    if (this.userId !== this.organizerId && !this.isAdmin) {
      throw new UnauthorizedException('No tienes permisos para ver estas estadísticas');
    }

    // Obtener fecha límite según el período seleccionado
    const startDate = this.getStartDateForPeriod();
    
    // Obtener eventos del organizador en el período seleccionado
    const events = await this.eventRepository.findByOrganizerId(this.organizerId, { startDate });

    // Calcular estadísticas generales
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.startDate) > now && !event.isCanceled);
    const pastEvents = events.filter(event => new Date(event.endDate) < now && !event.isCanceled);
    const canceledEvents = events.filter(event => event.isCanceled);
    
    // Calcular asistentes totales y boletos vendidos
    let totalAttendees = 0;
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    
    // Mapa para estadísticas por tipo de evento
    const revenueByEventType: Record<string, number> = {};
    
    // Mapa para eventos creados a lo largo del tiempo
    const eventsCreatedByPeriod = new Map<string, number>();
    
    // Mapa para tasa de asistencia a lo largo del tiempo
    const attendanceRateByPeriod = new Map<string, { total: number, events: number }>();
    
    // Procesar cada evento para estadísticas detalladas
    for (const event of events) {
      // Conteo de asistentes y boletos
      const attendees = event.attendees ? event.attendees.length : 0;
      totalAttendees += attendees;
      
      // Boletos vendidos y revenue (simplificado - en un caso real sería más complejo)
      const ticketsSold = event.ticketsSold || 0;
      totalTicketsSold += ticketsSold;
      
      const revenue = event.revenue || 0;
      totalRevenue += revenue;
      
      // Contabilizar por tipo de evento
      const eventType = event.eventType || 'Sin clasificar';
      revenueByEventType[eventType] = (revenueByEventType[eventType] || 0) + revenue;
      
      // Eventos creados por período
      const creationPeriod = this.getPeriodKey(new Date(event.createdAt));
      eventsCreatedByPeriod.set(
        creationPeriod, 
        (eventsCreatedByPeriod.get(creationPeriod) || 0) + 1
      );
      
      // Tasa de asistencia (si el evento ya terminó)
      if (new Date(event.endDate) < now && !event.isCanceled) {
        const periodKey = this.getPeriodKey(new Date(event.startDate));
        const currentStats = attendanceRateByPeriod.get(periodKey) || { total: 0, events: 0 };
        
        // Capacidad del evento (o un valor predeterminado si no está definido)
        const capacity = event.capacity || 0;
        
        // Solo calcular tasa si el evento tenía capacidad definida
        if (capacity > 0) {
          const attendanceRate = ticketsSold / capacity;
          attendanceRateByPeriod.set(periodKey, {
            total: currentStats.total + attendanceRate,
            events: currentStats.events + 1
          });
        }
      }
    }
    
    // Calcular promedio de asistentes por evento
    const averageAttendeesPerEvent = events.length ? totalAttendees / events.length : 0;
    
    // Preparar datos de eventos creados a lo largo del tiempo
    const eventsCreatedOverTime = Array.from(eventsCreatedByPeriod.entries())
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));
    
    // Preparar datos de tasa de asistencia a lo largo del tiempo
    const attendanceRateOverTime = Array.from(attendanceRateByPeriod.entries())
      .map(([period, stats]) => ({ 
        period, 
        rate: stats.events > 0 ? stats.total / stats.events : 0 
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
    
    // Identificar eventos más populares
    const mostPopularEvents = events
      .map(event => ({
        id: event.id,
        name: event.title,
        attendees: event.attendees ? event.attendees.length : 0
      }))
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, 5);  // Top 5
    
    // Retornar resultado consolidado
    return {
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
      canceledEvents: canceledEvents.length,
      totalAttendees,
      averageAttendeesPerEvent,
      totalTicketsSold,
      totalRevenue,
      revenueByEventType,
      eventsCreatedOverTime,
      attendanceRateOverTime,
      mostPopularEvents
    };
  }

  /**
   * Obtiene la fecha de inicio para el período seleccionado
   */
  private getStartDateForPeriod(): Date {
    const now = new Date();
    const startDate = new Date(now);
    
    switch (this.period) {
      case StatsPeriod.LAST_WEEK:
        startDate.setDate(now.getDate() - 7);
        break;
      case StatsPeriod.LAST_MONTH:
        startDate.setMonth(now.getMonth() - 1);
        break;
      case StatsPeriod.LAST_3_MONTHS:
        startDate.setMonth(now.getMonth() - 3);
        break;
      case StatsPeriod.LAST_YEAR:
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case StatsPeriod.ALL_TIME:
      default:
        // Para ALL_TIME, usamos una fecha muy antigua
        startDate.setFullYear(2000);
        break;
    }
    
    return startDate;
  }

  /**
   * Obtiene una clave para agrupar por períodos (mes-año)
   */
  private getPeriodKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  }
} 