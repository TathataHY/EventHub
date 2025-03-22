import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de notificaciones
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class NotificationCreateException extends DomainException {
  /**
   * Constructor de NotificationCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'NOTIFICATION_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'NOTIFICATION_CREATE_ERROR') {
    super(message, code);
    this.name = 'NotificationCreateException';
  }
} 