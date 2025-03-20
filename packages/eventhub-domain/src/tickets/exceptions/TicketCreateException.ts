import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción lanzada cuando ocurre un error durante la creación de un ticket
 * Extiende la clase base DomainException y establece un código específico
 */
export class TicketCreateException extends DomainException {
  /**
   * Constructor de la excepción para errores en la creación de tickets
   * @param message Mensaje descriptivo del error
   */
  constructor(message: string) {
    super('TicketCreateException', message);
  }
} 