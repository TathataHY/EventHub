import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la gestión de asistencia a eventos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class EventAttendanceException extends DomainException {
  /**
   * Constructor de EventAttendanceException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'EVENT_ATTENDANCE_ERROR')
   */
  constructor(message: string, code: string = 'EVENT_ATTENDANCE_ERROR') {
    super(message, code);
    this.name = 'EventAttendanceException';
  }
} 