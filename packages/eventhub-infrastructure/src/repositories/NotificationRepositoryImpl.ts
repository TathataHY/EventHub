import { Notification, NotificationRepository, FindNotificationsOptions } from 'eventhub-domain';
import { NotificationEntity } from '../entities/NotificationEntity';

/**
 * Implementación concreta del repositorio de notificaciones
 */
export class NotificationRepositoryImpl implements NotificationRepository {
  // En un caso real, aquí inyectaríamos un ORM o cliente de base de datos
  private notifications: NotificationEntity[] = [];

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(notification: Notification): NotificationEntity {
    return new NotificationEntity({
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    });
  }

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private toDomain(entity: NotificationEntity): Notification {
    return new Notification({
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      data: entity.data,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = this.notifications.find(n => n.id === id);
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: string, options: FindNotificationsOptions): Promise<{
    notifications: Notification[];
    total: number;
  }> {
    let filteredNotifications = this.notifications.filter(n => n.userId === userId);
    
    // Aplicar filtros
    if (options.onlyUnread) {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Calcular total
    const total = filteredNotifications.length;
    
    // Aplicar paginación
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedNotifications = filteredNotifications.slice(start, end);
    
    return {
      notifications: paginatedNotifications.map(entity => this.toDomain(entity)),
      total,
    };
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  async create(notification: Notification): Promise<Notification> {
    const entity = this.toEntity(notification);
    this.notifications.push(entity);
    return notification;
  }

  async update(notification: Notification): Promise<Notification> {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    
    if (index !== -1) {
      const entity = this.toEntity(notification);
      this.notifications[index] = entity;
    }
    
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications
      .filter(n => n.userId === userId && !n.isRead)
      .forEach(n => {
        n.isRead = true;
        n.updatedAt = new Date();
      });
  }

  async delete(id: string): Promise<void> {
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }
} 