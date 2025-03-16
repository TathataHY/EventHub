import { NotificationType } from 'eventhub-domain';

/**
 * DTO para la representación de notificaciones
 */
export interface NotificationDto {
  /**
   * ID de la notificación
   */
  id: string;

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

  /**
   * Si la notificación ha sido leída
   */
  isRead: boolean;

  /**
   * Fecha de creación de la notificación
   */
  createdAt: Date | string;

  /**
   * Fecha de última actualización de la notificación
   */
  updatedAt: Date | string;
} 