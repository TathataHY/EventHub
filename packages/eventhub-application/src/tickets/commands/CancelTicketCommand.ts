import { Command } from '../../core/interfaces/Command';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Parámetros para cancelar un ticket
 */
interface CancelTicketParams {
  ticketId: string;
  reason?: string;
}

/**
 * Comando para cancelar un ticket
 * Este comando marca un ticket como cancelado, con una razón opcional
 */
export class CancelTicketCommand implements Command<CancelTicketParams, boolean> {
  constructor(
    private ticketRepository: TicketRepositoryAdapter,
    private ticketId?: string,
    private reason?: string
  ) {}

  /**
   * Ejecuta el comando de cancelación de ticket
   * @param params Parámetros con el ID del ticket y la razón opcional
   * @returns true si el ticket fue cancelado correctamente
   * @throws Error si el ticket no existe o ya está cancelado
   */
  async execute(params?: CancelTicketParams): Promise<boolean> {
    const ticketId = params?.ticketId || this.ticketId;
    const reason = params?.reason || this.reason;
    
    if (!ticketId) {
      throw new Error('Se requiere un ID de ticket para cancelarlo');
    }
    
    // Verificar si el ticket existe
    const ticket = await this.ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new ValidationException('El ticket no existe');
    }
    
    // Verificar si el ticket ya ha sido cancelado
    if (ticket.status === 'canceled') {
      throw new ValidationException('El ticket ya ha sido cancelado');
    }
    
    // Verificar si el ticket ya ha sido validado/usado
    if (ticket.validated) {
      throw new ValidationException('No se puede cancelar un ticket que ya ha sido utilizado');
    }
    
    // Cancelar el ticket
    const result = await this.ticketRepository.cancelTicket(ticketId, reason);
    
    return result;
  }
} 