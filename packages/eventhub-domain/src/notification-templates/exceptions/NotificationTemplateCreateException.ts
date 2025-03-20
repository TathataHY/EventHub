import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de plantillas de notificación
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class NotificationTemplateCreateException extends DomainException {
  /**
   * Constructor de NotificationTemplateCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'NOTIFICATION_TEMPLATE_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'NOTIFICATION_TEMPLATE_CREATE_ERROR') {
    super(message, code);
    this.name = 'NotificationTemplateCreateException';
  }
} 