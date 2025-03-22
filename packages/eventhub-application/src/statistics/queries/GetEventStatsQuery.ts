import { Query } from '../../core/interfaces/Query';
import { ValidationException, NotFoundException, UnauthorizedException } from '../../core/exceptions';
import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { AttendeeRepository } from '@eventhub/domain/dist/attendees/repositories/AttendeeRepository';

/**
 * Resultados de estadísticas de un evento
 */
export interface EventStats {
  eventId: string;
  eventName: string;
  // Métricas de asistencia
  capacity: number;
  registeredAttendees: number;
  checkedInAttendees: number;
  attendanceRate: number;
  // Métricas de tickets
  totalTickets: number;
  ticketsSold: number;
  ticketsReserved: number;
  ticketsCanceled: number;
  // Métricas financieras
  totalRevenue: number;
  averageTicketPrice: number;
  revenueByTicketType: Record<string, number>;
  // Métricas temporales
  registrationsByDay: {
    date: string;
    count: number;
  }[];
  // Demografía
  attendeesByGender?: Record<string, number>;
  attendeesByAgeGroup?: Record<string, number>;
  attendeesByLocation?: Record<string, number>;
  // Engagement
  invitationsSent: number;
  invitationsAccepted: number;
  conversionRate: number;
}

/**
 * Consulta para obtener estadísticas de un evento
 */
export class GetEventStatsQuery implements Query<EventStats> {
  constructor(
    private readonly eventId: string,
    private readonly userId: string,
    private readonly eventRepository: EventRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly attendeeRepository: AttendeeRepository,
    private readonly isAdmin: boolean = false
  ) {}

  /**
   * Ejecuta la consulta para obtener estadísticas de un evento
   * @returns Promise<EventStats> Estadísticas del evento
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el evento no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<EventStats> {
    // Validación básica
    if (!this.eventId) {
      throw new ValidationException('ID de evento es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    // Obtener el evento
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException('Evento', this.eventId);
    }

    // Verificar permisos (sólo el organizador o admins)
    if (event.organizerId !== this.userId && !this.isAdmin) {
      throw new UnauthorizedException('No tienes permisos para ver estas estadísticas');
    }

    // Obtener datos de tickets
    const tickets = await this.ticketRepository.findByEventId(this.eventId);
    
    // Obtener datos de asistentes
    const attendees = await this.attendeeRepository.findByEventId(this.eventId);
    
    // Calcular métricas de asistencia
    const capacity = event.capacity || 0;
    const registeredAttendees = attendees.length;
    const checkedInAttendees = attendees.filter(a => a.checkedIn).length;
    const attendanceRate = capacity > 0 ? (checkedInAttendees / capacity) * 100 : 0;
    
    // Calcular métricas de tickets
    const totalTickets = tickets.length;
    const ticketsSold = tickets.filter(t => t.status === 'sold').length;
    const ticketsReserved = tickets.filter(t => t.status === 'reserved').length;
    const ticketsCanceled = tickets.filter(t => t.status === 'canceled').length;
    
    // Calcular métricas financieras
    const soldTickets = tickets.filter(t => t.status === 'sold');
    const totalRevenue = soldTickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0);
    const averageTicketPrice = soldTickets.length > 0 ? totalRevenue / soldTickets.length : 0;
    
    // Calcular revenue por tipo de ticket
    const revenueByTicketType: Record<string, number> = {};
    for (const ticket of soldTickets) {
      const ticketType = ticket.type || 'General';
      if (!revenueByTicketType[ticketType]) {
        revenueByTicketType[ticketType] = 0;
      }
      revenueByTicketType[ticketType] += ticket.price || 0;
    }
    
    // Calcular registros por día
    const registrationsByDay = this.calculateRegistrationsByDay(attendees);
    
    // Calcular demografía (si hay datos disponibles)
    const attendeesByGender = this.calculateAttendeesByGender(attendees);
    const attendeesByAgeGroup = this.calculateAttendeesByAgeGroup(attendees);
    const attendeesByLocation = this.calculateAttendeesByLocation(attendees);
    
    // Calcular engagement
    const invitationsSent = event.invitationsSent || 0;
    const invitationsAccepted = event.invitationsAccepted || 0;
    const conversionRate = invitationsSent > 0 ? (invitationsAccepted / invitationsSent) * 100 : 0;
    
    // Retornar estadísticas
    return {
      eventId: event.id,
      eventName: event.title,
      capacity,
      registeredAttendees,
      checkedInAttendees,
      attendanceRate,
      totalTickets,
      ticketsSold,
      ticketsReserved,
      ticketsCanceled,
      totalRevenue,
      averageTicketPrice,
      revenueByTicketType,
      registrationsByDay,
      attendeesByGender,
      attendeesByAgeGroup,
      attendeesByLocation,
      invitationsSent,
      invitationsAccepted,
      conversionRate
    };
  }

  /**
   * Calcula el número de registros por día
   */
  private calculateRegistrationsByDay(attendees: any[]): { date: string; count: number }[] {
    const registrationsByDay = new Map<string, number>();
    
    for (const attendee of attendees) {
      if (attendee.registrationDate) {
        const date = new Date(attendee.registrationDate);
        const dateKey = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        const currentCount = registrationsByDay.get(dateKey) || 0;
        registrationsByDay.set(dateKey, currentCount + 1);
      }
    }
    
    return Array.from(registrationsByDay.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Calcula la distribución de asistentes por género
   */
  private calculateAttendeesByGender(attendees: any[]): Record<string, number> {
    const genderDistribution: Record<string, number> = {};
    
    for (const attendee of attendees) {
      if (attendee.gender) {
        genderDistribution[attendee.gender] = (genderDistribution[attendee.gender] || 0) + 1;
      }
    }
    
    return genderDistribution;
  }

  /**
   * Calcula la distribución de asistentes por grupo de edad
   */
  private calculateAttendeesByAgeGroup(attendees: any[]): Record<string, number> {
    const ageGroups: Record<string, number> = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55-64': 0,
      '65+': 0,
      'Unknown': 0
    };
    
    for (const attendee of attendees) {
      if (!attendee.age) {
        ageGroups['Unknown']++;
        continue;
      }
      
      const age = Number(attendee.age);
      
      if (age < 18) ageGroups['Under 18']++;
      else if (age < 25) ageGroups['18-24']++;
      else if (age < 35) ageGroups['25-34']++;
      else if (age < 45) ageGroups['35-44']++;
      else if (age < 55) ageGroups['45-54']++;
      else if (age < 65) ageGroups['55-64']++;
      else ageGroups['65+']++;
    }
    
    // Eliminar categorías sin datos
    Object.keys(ageGroups).forEach(key => {
      if (ageGroups[key] === 0) {
        delete ageGroups[key];
      }
    });
    
    return ageGroups;
  }

  /**
   * Calcula la distribución de asistentes por ubicación
   */
  private calculateAttendeesByLocation(attendees: any[]): Record<string, number> {
    const locationDistribution: Record<string, number> = {};
    
    for (const attendee of attendees) {
      if (attendee.location) {
        locationDistribution[attendee.location] = (locationDistribution[attendee.location] || 0) + 1;
      }
    }
    
    return locationDistribution;
  }
} 