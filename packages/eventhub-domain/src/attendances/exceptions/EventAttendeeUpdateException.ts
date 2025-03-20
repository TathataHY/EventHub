import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de asistencias a eventos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class EventAttendeeUpdateException extends DomainException {
  /**
   * Constructor de EventAttendeeUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'EVENT_ATTENDEE_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'EVENT_ATTENDEE_UPDATE_ERROR') {
    super(message, code);
    this.name = 'EventAttendeeUpdateException';
  }
} 