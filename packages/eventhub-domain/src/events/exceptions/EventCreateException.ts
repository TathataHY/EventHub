import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de eventos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class EventCreateException extends DomainException {
  /**
   * Constructor de EventCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'EVENT_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'EVENT_CREATE_ERROR') {
    super(message, code);
    this.name = 'EventCreateException';
  }
} 