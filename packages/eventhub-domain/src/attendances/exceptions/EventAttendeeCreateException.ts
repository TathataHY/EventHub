import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de asistencias a eventos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class EventAttendeeCreateException extends DomainException {
  /**
   * Constructor de EventAttendeeCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'EVENT_ATTENDEE_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'EVENT_ATTENDEE_CREATE_ERROR') {
    super(message, code);
    this.name = 'EventAttendeeCreateException';
  }
} 