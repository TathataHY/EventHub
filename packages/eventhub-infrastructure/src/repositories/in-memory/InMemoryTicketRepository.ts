import { 
  FindTicketsOptions, 
  ITicketRepository, 
  Ticket, 
  TicketStatus 
} from 'eventhub-domain';
import { v4 as uuidv4 } from 'uuid';

/**
 * Implementación en memoria del repositorio de tickets para pruebas
 */
export class InMemoryTicketRepository implements ITicketRepository {
  private tickets: Map<string, Ticket> = new Map();
  private ticketsByCode: Map<string, string> = new Map(); // Mapeo código -> id

  /**
   * Guarda un ticket
   */
  async save(ticket: Ticket): Promise<Ticket> {
    // Si no tiene ID, asignar uno
    if (!ticket.id) {
      const newTicket = new Ticket({
        ...ticket,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.tickets.set(newTicket.id, newTicket);
      this.ticketsByCode.set(newTicket.code, newTicket.id);
      
      return newTicket;
    }
    
    // Si ya existe, actualizar
    const existingTicket = this.tickets.get(ticket.id);
    if (existingTicket) {
      const updatedTicket = new Ticket({
        ...ticket,
        updatedAt: new Date()
      });
      
      this.tickets.set(ticket.id, updatedTicket);
      
      // Actualizar el mapeo de código si ha cambiado
      if (existingTicket.code !== updatedTicket.code) {
        this.ticketsByCode.delete(existingTicket.code);
        this.ticketsByCode.set(updatedTicket.code, updatedTicket.id);
      }
      
      return updatedTicket;
    }
    
    // Si no existe pero tiene ID, guardar
    this.tickets.set(ticket.id, ticket);
    this.ticketsByCode.set(ticket.code, ticket.id);
    
    return ticket;
  }

  /**
   * Busca un ticket por ID
   */
  async findById(id: string): Promise<Ticket | null> {
    return this.tickets.get(id) || null;
  }

  /**
   * Busca un ticket por código
   */
  async findByCode(code: string): Promise<Ticket | null> {
    const id = this.ticketsByCode.get(code);
    if (!id) return null;
    return this.tickets.get(id) || null;
  }

  /**
   * Busca tickets con opciones de filtrado
   */
  async findTickets(options: FindTicketsOptions): Promise<{ tickets: Ticket[]; total: number }> {
    const { 
      userId, 
      eventId, 
      status, 
      validFrom, 
      validUntil, 
      code,
      page = 1, 
      perPage = 10 
    } = options;
    
    let filteredTickets = Array.from(this.tickets.values());
    
    // Aplicar filtros
    if (userId) {
      filteredTickets = filteredTickets.filter(t => t.userId === userId);
    }
    
    if (eventId) {
      filteredTickets = filteredTickets.filter(t => t.eventId === eventId);
    }
    
    if (status !== undefined) {
      filteredTickets = filteredTickets.filter(t => t.status === status);
    }
    
    if (code) {
      filteredTickets = filteredTickets.filter(t => t.code === code);
    }
    
    if (validFrom) {
      filteredTickets = filteredTickets.filter(t => t.validFrom >= validFrom);
    }
    
    if (validUntil) {
      filteredTickets = filteredTickets.filter(t => t.validUntil <= validUntil);
    }
    
    // Ordenar por fecha de creación (más reciente primero)
    filteredTickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Obtener total antes de paginar
    const total = filteredTickets.length;
    
    // Aplicar paginación
    const startIndex = (page - 1) * perPage;
    filteredTickets = filteredTickets.slice(startIndex, startIndex + perPage);
    
    return { tickets: filteredTickets, total };
  }

  /**
   * Busca tickets por usuario
   */
  async findByUserId(userId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Busca tickets por evento
   */
  async findByEventId(eventId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.eventId === eventId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Busca tickets por pago
   */
  async findByPaymentId(paymentId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.paymentId === paymentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Busca tickets por evento y estado
   */
  async findByEventIdAndStatus(eventId: string, status: TicketStatus): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.eventId === eventId && ticket.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Cuenta tickets por evento y estado
   */
  async countByEventIdAndStatus(eventId: string, status: TicketStatus): Promise<number> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.eventId === eventId && ticket.status === status)
      .length;
  }

  /**
   * Verifica si un usuario tiene un ticket válido para un evento
   */
  async hasValidTicket(userId: string, eventId: string): Promise<boolean> {
    const now = new Date();
    const validStates = [TicketStatus.PAID, TicketStatus.VALIDATED, TicketStatus.RESERVED];
    
    return Array.from(this.tickets.values()).some(ticket => 
      ticket.userId === userId &&
      ticket.eventId === eventId &&
      validStates.includes(ticket.status) &&
      ticket.validFrom <= now &&
      ticket.validUntil >= now &&
      !ticket.isUsed
    );
  }
  
  /**
   * Método para limpiar todos los tickets (uso en pruebas)
   */
  clear(): void {
    this.tickets.clear();
    this.ticketsByCode.clear();
  }
} 