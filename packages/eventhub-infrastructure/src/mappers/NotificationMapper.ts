import { Notification } from 'eventhub-domain';
import { NotificationEntity } from '../entities/NotificationEntity';
import { NotificationDto } from 'eventhub-application';

/**
 * Mapper para transformar entre entidades de dominio y entidades de TypeORM para notificaciones
 */
export class NotificationMapper {
  /**
   * Convierte una entidad de dominio a una entidad de TypeORM
   * @param notification Entidad de dominio
   * @returns Entidad de TypeORM
   */
  static toEntity(notification: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    
    entity.id = notification.id;
    entity.userId = notification.userId;
    entity.title = notification.title;
    entity.message = notification.message;
    entity.type = notification.type;
    entity.channel = notification.channel;
    entity.html = notification.html;
    entity.read = notification.read;
    entity.sent = notification.sent;
    entity.deliveredAt = notification.deliveredAt;
    entity.readAt = notification.readAt;
    entity.relatedEntityId = notification.relatedEntityId;
    entity.relatedEntityType = notification.relatedEntityType;
    entity.priority = notification.priority;
    entity.data = notification.data;
    entity.createdAt = notification.createdAt;
    entity.updatedAt = notification.updatedAt;
    
    return entity;
  }

  /**
   * Convierte una entidad de TypeORM a una entidad de dominio
   * @param entity Entidad de TypeORM
   * @returns Entidad de dominio
   */
  static toDomain(entity: NotificationEntity): Notification {
    return new Notification({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      channel: entity.channel,
      html: entity.html,
      read: entity.read,
      sent: entity.sent,
      deliveredAt: entity.deliveredAt,
      readAt: entity.readAt,
      relatedEntityId: entity.relatedEntityId,
      relatedEntityType: entity.relatedEntityType,
      priority: entity.priority,
      data: entity.data,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  /**
   * Convierte una entidad Notification a un DTO
   * @param notification Entidad Notification
   * @returns DTO de la notificación
   */
  static toDto(notification: Notification): NotificationDto {
    return {
      id: notification.id as string,
      userId: notification.userId,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      isRead: notification.isRead,
      relatedEntityId: notification.relatedEntityId,
      relatedEntityType: notification.relatedEntityType,
      metadata: notification.metadata || {},
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    };
  }

  /**
   * Convierte un array de entidades Notification a un array de DTOs
   * @param notifications Array de entidades Notification
   * @returns Array de DTOs
   */
  static toDtoArray(notifications: Notification[]): NotificationDto[] {
    return notifications.map(notification => this.toDto(notification));
  }
} 