import { Notification, NotificationCreateProps } from '@eventhub/domain/dist/notifications/entities/Notification';
import { NotificationType } from '@eventhub/domain/dist/notifications/value-objects/NotificationType';
import { NotificationChannel } from '@eventhub/domain/dist/notifications/value-objects/NotificationChannel';

/**
 * Adaptador para convertir Notification entre el dominio y la aplicación
 */
export class NotificationAdapter {
  /**
   * Convierte una notificación del dominio a formato de aplicación
   */
  static toApplication(notification: Notification | null): any {
    if (!notification) return null;

    // Convertir la entidad de dominio a un objeto plano para aplicación
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      html: notification.html,
      type: notification.type.value,
      channel: notification.channel.value,
      read: notification.read,
      sent: notification.sent,
      deliveredAt: notification.deliveredAt,
      readAt: notification.readAt,
      priority: notification.priority,
      relatedEntityId: notification.relatedEntityId,
      relatedEntityType: notification.relatedEntityType,
      data: notification.data,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      isActive: notification.isActive
    };
  }

  /**
   * Convierte una notificación de aplicación a formato de dominio
   */
  static toDomain(appNotification: any): NotificationCreateProps {
    if (!appNotification) return null;

    // Convertir el objeto de aplicación a las props necesarias para crear una entidad de dominio
    // Debido a que no podemos crear directamente una instancia de value objects como NotificationType
    // desde la capa de aplicación, simulamos la estructura que espera el dominio
    return {
      id: appNotification.id,
      userId: appNotification.userId,
      title: appNotification.title,
      message: appNotification.message,
      html: appNotification.html,
      type: appNotification.type, // Automáticamente se convertirá en NotificationType en el dominio
      channel: appNotification.channel, // Automáticamente se convertirá en NotificationChannel en el dominio
      read: appNotification.read || false,
      sent: appNotification.sent || false,
      deliveredAt: appNotification.deliveredAt,
      readAt: appNotification.readAt,
      priority: appNotification.priority || 'medium',
      relatedEntityId: appNotification.relatedEntityId,
      relatedEntityType: appNotification.relatedEntityType,
      data: appNotification.data,
      createdAt: appNotification.createdAt || new Date(),
      updatedAt: appNotification.updatedAt || new Date(),
      isActive: appNotification.isActive !== undefined ? appNotification.isActive : true
    };
  }
} 