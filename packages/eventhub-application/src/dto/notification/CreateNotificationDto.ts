import { NotificationType } from 'eventhub-domain';

/**
 * DTO para la creación de notificaciones
 */
export interface CreateNotificationDto {
  /**
   * ID del usuario destinatario
   */
  userId: string;

  /**
   * Tipo de notificación
   */
  type: NotificationType;

  /**
   * Título de la notificación
   */
  title: string;

  /**
   * Mensaje de la notificación
   */
  message: string;

  /**
   * Datos adicionales relacionados con la notificación
   */
  data?: Record<string, any>;
} 