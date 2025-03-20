import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de tickets
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class TicketCreateException extends DomainException {
  /**
   * Constructor de TicketCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'TICKET_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'TICKET_CREATE_ERROR') {
    super(message, code);
    this.name = 'TicketCreateException';
  }
} 