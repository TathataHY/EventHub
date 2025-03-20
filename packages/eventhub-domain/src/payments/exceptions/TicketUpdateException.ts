import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de tickets
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class TicketUpdateException extends DomainException {
  /**
   * Constructor de TicketUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'TICKET_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'TICKET_UPDATE_ERROR') {
    super(message, code);
    this.name = 'TicketUpdateException';
  }
} 