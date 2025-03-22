import { TicketRepository, TicketFilterOptions, PaginationOptions, PaginatedTicketsResult } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { Ticket } from '@eventhub/domain/dist/tickets/entities/Ticket';
import { Event } from '@eventhub/domain/dist/events/entities/Event';
import { User } from '@eventhub/domain/dist/users/entities/User';
import { TicketStatus } from '@eventhub/domain/dist/tickets/value-objects/TicketStatus';
import { TicketType } from '@eventhub/domain/dist/tickets/value-objects/TicketType';
import { TicketAdapter } from './TicketAdapter';

/**
 * Adaptador para el repositorio de tickets que resuelve incompatibilidades de tipos
 * entre la capa de dominio y la capa de aplicación
 */
export class TicketRepositoryAdapter {
  constructor(private repository: TicketRepository) {}

  // Métodos principales para la capa de aplicación
  
  async findById(id: string): Promise<any> {
    const ticket = await (this.repository as any).findById(id);
    return ticket ? TicketAdapter.toApplication(ticket) : null;
  }

  async findByEvent(eventId: string | Event): Promise<any[]> {
    const event = typeof eventId === 'string' ? { id: eventId } as unknown as Event : eventId;
    const tickets = await this.repository.findByEvent(event);
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async findByUser(userId: string | User): Promise<any[]> {
    const user = typeof userId === 'string' ? { id: userId } as unknown as User : userId;
    const tickets = await this.repository.findByUser(user);
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async findByStatus(status: string | TicketStatus): Promise<any[]> {
    const statusObj = typeof status === 'string' ? { value: status } as unknown as TicketStatus : status;
    const tickets = await this.repository.findByStatus(statusObj);
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async findByType(type: string | TicketType): Promise<any[]> {
    const typeObj = typeof type === 'string' ? { value: type } as unknown as TicketType : type;
    const tickets = await this.repository.findByType(typeObj);
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async save(ticket: any): Promise<any> {
    const domainTicket = TicketAdapter.toDomain(ticket);
    const savedTicket = await (this.repository as any).save(domainTicket);
    return TicketAdapter.toApplication(savedTicket);
  }

  async delete(ticketId: string | any): Promise<boolean> {
    if (typeof ticketId === 'string') {
      return await (this.repository as any).delete(ticketId);
    } else {
      const ticketIdentifier = typeof ticketId === 'object' && ticketId !== null ? ticketId.id : ticketId;
      return await (this.repository as any).delete(ticketIdentifier);
    }
  }

  async findAll(): Promise<any[]> {
    const tickets = await this.repository.findAll();
    return Array.isArray(tickets) ? tickets.map(ticket => TicketAdapter.toApplication(ticket)) : [];
  }
  
  async validateTicket(ticketId: string): Promise<boolean> {
    const ticket = await this.findById(ticketId);
    if (!ticket) return false;
    
    ticket.validated = true;
    ticket.validatedAt = new Date();
    await this.save(ticket);
    return true;
  }
  
  async cancelTicket(ticketId: string, reason?: string): Promise<boolean> {
    const ticket = await this.findById(ticketId);
    if (!ticket) return false;
    
    ticket.status = 'canceled';
    ticket.cancellationReason = reason;
    ticket.canceledAt = new Date();
    await this.save(ticket);
    return true;
  }

  async findWithFilters(filters?: TicketFilterOptions, pagination?: PaginationOptions): Promise<any> {
    const result = await this.repository.findWithFilters(filters, pagination);
    return {
      tickets: result.tickets.map(ticket => TicketAdapter.toApplication(ticket)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  async findAvailableTickets(): Promise<any[]> {
    const tickets = await this.repository.findAvailableTickets();
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async findSoldTickets(): Promise<any[]> {
    const tickets = await this.repository.findSoldTickets();
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async findActiveTickets(): Promise<any[]> {
    const tickets = await this.repository.findActiveTickets();
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async findInactiveTickets(): Promise<any[]> {
    const tickets = await this.repository.findInactiveTickets();
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }

  async searchByText(query: string): Promise<any[]> {
    const tickets = await this.repository.searchByText(query);
    return tickets.map(ticket => TicketAdapter.toApplication(ticket));
  }
} 