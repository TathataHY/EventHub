import { Command } from '../../core/interfaces/Command';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Comando para validar un ticket
 * Este comando marca un ticket como validado, lo que significa
 * que el asistente ha entrado al evento y su entrada ha sido verificada
 */
export class ValidateTicketCommand implements Command<string, boolean> {
  constructor(
    private ticketRepository: TicketRepositoryAdapter,
    private ticketId?: string
  ) {}

  /**
   * Ejecuta el comando de validación de ticket
   * @param ticketId ID del ticket a validar, opcional si se proporcionó en el constructor
   * @returns true si el ticket fue validado correctamente
   * @throws Error si el ticket no existe o ya está validado
   */
  async execute(ticketId?: string): Promise<boolean> {
    const targetTicketId = ticketId || this.ticketId;
    
    if (!targetTicketId) {
      throw new Error('Se requiere un ID de ticket para validarlo');
    }
    
    // Verificar si el ticket existe
    const ticket = await this.ticketRepository.findById(targetTicketId);
    
    if (!ticket) {
      throw new ValidationException('El ticket no existe');
    }
    
    // Verificar si el ticket ya ha sido validado
    if (ticket.validated) {
      throw new ValidationException('El ticket ya ha sido validado');
    }
    
    // Verificar que el ticket esté en estado "vendido" (no cancelado, no disponible)
    if (ticket.status !== 'sold') {
      throw new ValidationException(`No se puede validar un ticket con estado "${ticket.status}"`);
    }
    
    // Validar el ticket
    const result = await this.ticketRepository.validateTicket(targetTicketId);
    
    return result;
  }
} 