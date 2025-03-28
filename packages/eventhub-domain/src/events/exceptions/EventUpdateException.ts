import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de eventos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class EventUpdateException extends DomainException {
  /**
   * Constructor de EventUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'EVENT_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'EVENT_UPDATE_ERROR') {
    super(message, code);
    this.name = 'EventUpdateException';
  }
} 