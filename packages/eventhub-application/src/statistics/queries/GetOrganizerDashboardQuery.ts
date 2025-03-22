import { Query } from '../../core/interfaces/Query';
import { ValidationException, NotFoundException, UnauthorizedException } from '../../core/exceptions';
import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { PaymentRepository } from '@eventhub/domain/dist/payments/repositories/PaymentRepository';

/**
 * Resultado del dashboard del organizador
 */
export interface OrganizerDashboard {
  // Resumen de información
  organizerId: string;
  organizerName: string;
  // Métricas de eventos
  activeEvents: number;
  totalEvents: number;
  upcomingEvents: {
    id: string;
    title: string;
    startDate: Date;
    registeredAttendees: number;
    capacity: number;
  }[];
  // Métricas de ventas
  recentSales: {
    date: string;
    amount: number;
    eventId: string;
    eventName: string;
  }[];
  totalSalesThisMonth: number;
  totalSalesLastMonth: number;
  salesTrend: 'up' | 'down' | 'stable';
  // Métricas de audiencia
  totalAttendees: number;
  newAttendeesThisMonth: number;
  topAttendees: {
    userId: string;
    name: string;
    eventsAttended: number;
  }[];
  // Notificaciones y alertas
  alerts: {
    type: 'warning' | 'info' | 'success',
    message: string,
    eventId?: string
  }[];
}

/**
 * Consulta para obtener el dashboard del organizador
 */
export class GetOrganizerDashboardQuery implements Query<OrganizerDashboard> {
  constructor(
    private readonly organizerId: string,
    private readonly userId: string,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly isAdmin: boolean = false
  ) {}

  /**
   * Ejecuta la consulta para obtener el dashboard del organizador
   * @returns Promise<OrganizerDashboard> Dashboard del organizador
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el organizador no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<OrganizerDashboard> {
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
      throw new UnauthorizedException('No tienes permisos para ver este dashboard');
    }

    // Obtener eventos del organizador
    const events = await this.eventRepository.findByOrganizerId(this.organizerId);

    // Fecha actual
    const now = new Date();
    
    // Obtener eventos activos (no cancelados y que no han terminado)
    const activeEvents = events.filter(
      event => !event.isCanceled && new Date(event.endDate) >= now
    );
    
    // Obtener próximos eventos (ordenados por fecha de inicio)
    const upcomingEvents = events
      .filter(event => 
        !event.isCanceled && new Date(event.startDate) > now
      )
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5) // Limitar a 5 próximos eventos
      .map(event => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.startDate),
        registeredAttendees: event.attendees?.length || 0,
        capacity: event.capacity || 0
      }));

    // Obtener ventas recientes
    const recentPayments = await this.paymentRepository.findByOrganizerId(
      this.organizerId, 
      { limit: 10, status: 'completed' }
    );
    
    const recentSales = recentPayments.map(payment => {
      const event = events.find(e => e.id === payment.eventId);
      return {
        date: payment.completedAt.toISOString().split('T')[0],
        amount: payment.amount,
        eventId: payment.eventId,
        eventName: event?.title || 'Evento desconocido'
      };
    });

    // Calcular ventas del mes actual y anterior
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const isCurrentMonth = (date: Date) => 
      date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    
    const isLastMonth = (date: Date) => 
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    
    // Obtener todos los pagos completados
    const allPayments = await this.paymentRepository.findByOrganizerId(
      this.organizerId, 
      { status: 'completed' }
    );
    
    const totalSalesThisMonth = allPayments
      .filter(payment => isCurrentMonth(new Date(payment.completedAt)))
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalSalesLastMonth = allPayments
      .filter(payment => isLastMonth(new Date(payment.completedAt)))
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Determinar tendencia de ventas
    let salesTrend: 'up' | 'down' | 'stable' = 'stable';
    if (totalSalesThisMonth > totalSalesLastMonth) {
      salesTrend = 'up';
    } else if (totalSalesThisMonth < totalSalesLastMonth) {
      salesTrend = 'down';
    }

    // Calcular métricas de audiencia
    // Recopilar todos los asistentes
    const allAttendees = new Map<string, { userId: string, name: string, count: number }>();
    let newAttendeesThisMonth = 0;
    
    for (const event of events) {
      if (!event.attendees) continue;
      
      for (const attendee of event.attendees) {
        // Contar asistentes únicos
        if (!allAttendees.has(attendee.userId)) {
          allAttendees.set(attendee.userId, { 
            userId: attendee.userId,
            name: attendee.name || 'Desconocido',
            count: 0
          });
          
          // Verificar si es un nuevo asistente este mes
          if (isCurrentMonth(new Date(attendee.registrationDate))) {
            newAttendeesThisMonth++;
          }
        }
        
        // Incrementar contador de eventos asistidos
        const attendeeInfo = allAttendees.get(attendee.userId);
        if (attendeeInfo) {
          attendeeInfo.count++;
        }
      }
    }
    
    // Convertir el mapa a array y ordenar por eventos asistidos
    const sortedAttendees = Array.from(allAttendees.values())
      .sort((a, b) => b.count - a.count);
    
    // Obtener top 5 asistentes
    const topAttendees = sortedAttendees.slice(0, 5).map(a => ({
      userId: a.userId,
      name: a.name,
      eventsAttended: a.count
    }));

    // Generar alertas y notificaciones
    const alerts: {
      type: 'warning' | 'info' | 'success',
      message: string,
      eventId?: string
    }[] = [];
    
    // Alerta para eventos con baja venta de entradas
    for (const event of activeEvents) {
      const startDate = new Date(event.startDate);
      const daysUntilEvent = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Si faltan menos de 7 días y tiene menos del 30% vendido
      if (daysUntilEvent < 7 && daysUntilEvent >= 0) {
        const soldPercent = event.capacity > 0 
          ? ((event.attendees?.length || 0) / event.capacity) * 100 
          : 0;
        
        if (soldPercent < 30) {
          alerts.push({
            type: 'warning',
            message: `El evento "${event.title}" comienza en ${daysUntilEvent} días y solo tiene un ${Math.round(soldPercent)}% de entradas vendidas.`,
            eventId: event.id
          });
        }
      }
    }
    
    // Alerta de éxito para eventos con buena venta de entradas
    for (const event of activeEvents) {
      const soldPercent = event.capacity > 0 
        ? ((event.attendees?.length || 0) / event.capacity) * 100 
        : 0;
      
      if (soldPercent >= 90) {
        alerts.push({
          type: 'success',
          message: `¡El evento "${event.title}" ha alcanzado el ${Math.round(soldPercent)}% de su capacidad!`,
          eventId: event.id
        });
      }
    }
    
    // Información sobre tendencia de ventas
    if (salesTrend === 'up' && totalSalesLastMonth > 0) {
      const increasePercent = ((totalSalesThisMonth - totalSalesLastMonth) / totalSalesLastMonth) * 100;
      alerts.push({
        type: 'info',
        message: `Las ventas han aumentado un ${Math.round(increasePercent)}% respecto al mes anterior.`
      });
    }
    
    // Ordenar alertas por tipo (warning primero, luego info, luego success)
    const alertOrder = { 'warning': 0, 'info': 1, 'success': 2 };
    alerts.sort((a, b) => alertOrder[a.type] - alertOrder[b.type]);

    // Construir y retornar el dashboard
    return {
      organizerId: this.organizerId,
      organizerName: organizer.name || 'Organizador',
      activeEvents: activeEvents.length,
      totalEvents: events.length,
      upcomingEvents,
      recentSales,
      totalSalesThisMonth,
      totalSalesLastMonth,
      salesTrend,
      totalAttendees: allAttendees.size,
      newAttendeesThisMonth,
      topAttendees,
      alerts
    };
  }
} 