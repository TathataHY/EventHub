import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de plantillas de notificación
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class NotificationTemplateUpdateException extends DomainException {
  /**
   * Constructor de NotificationTemplateUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'NOTIFICATION_TEMPLATE_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'NOTIFICATION_TEMPLATE_UPDATE_ERROR') {
    super(message, code);
    this.name = 'NotificationTemplateUpdateException';
  }
} 