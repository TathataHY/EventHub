import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en las preferencias de notificaciones
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class NotificationPreferenceException extends DomainException {
  /**
   * Constructor de NotificationPreferenceException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'NOTIFICATION_PREFERENCE_ERROR')
   */
  constructor(message: string, code: string = 'NOTIFICATION_PREFERENCE_ERROR') {
    super(message, code);
    this.name = 'NotificationPreferenceException';
  }
} 