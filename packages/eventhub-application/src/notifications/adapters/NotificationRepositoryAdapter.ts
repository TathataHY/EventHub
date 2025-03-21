import { NotificationRepository } from '@eventhub/domain/dist/notifications/repositories/NotificationRepository';
import { Notification } from '@eventhub/domain/dist/notifications/entities/Notification';
import { NotificationAdapter } from './NotificationAdapter';
import { FindNotificationsOptions } from '@eventhub/domain/dist/notifications/repositories/NotificationRepository';

/**
 * Adaptador para el repositorio de notificaciones que resuelve incompatibilidades de tipos
 * entre la capa de dominio y aplicación
 */
export class NotificationRepositoryAdapter {
  constructor(private repository: NotificationRepository) {}

  async findById(id: string): Promise<any> {
    const notification = await this.repository.findById(id);
    return NotificationAdapter.toApplication(notification);
  }

  async findByUserId(userId: string): Promise<any[]> {
    const notifications = await this.repository.findByUserId(userId);
    return notifications.map(notification => NotificationAdapter.toApplication(notification));
  }

  async findByUserIdAndReadStatus(userId: string, read: boolean): Promise<any[]> {
    const notifications = await this.repository.findByUserIdAndReadStatus(userId, read);
    return notifications.map(notification => NotificationAdapter.toApplication(notification));
  }

  async findUnreadByUserId(userId: string): Promise<any[]> {
    const notifications = await this.repository.findUnreadByUserId(userId);
    return notifications.map(notification => NotificationAdapter.toApplication(notification));
  }

  async findByUserIdWithOptions(userId: string, options: FindNotificationsOptions): Promise<any> {
    const result = await this.repository.findByUserIdWithOptions(userId, options);
    return {
      notifications: result.notifications.map(notification => NotificationAdapter.toApplication(notification)),
      total: result.total
    };
  }

  async findByUserIdAndType(userId: string, type: string): Promise<any[]> {
    const notifications = await this.repository.findByUserIdAndType(userId, type);
    return notifications.map(notification => NotificationAdapter.toApplication(notification));
  }

  async countUnread(userId: string): Promise<number> {
    return await this.repository.countUnread(userId);
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return await this.repository.countUnreadByUserId(userId);
  }

  async create(notification: any): Promise<string> {
    const domainNotification = NotificationAdapter.toDomain(notification);
    return await this.repository.create(domainNotification);
  }

  async update(id: string, notification: any): Promise<void> {
    const domainNotification = NotificationAdapter.toDomain(notification);
    await this.repository.update(id, domainNotification);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async markAsRead(id: string, read: boolean = true): Promise<void> {
    await this.repository.markAsRead(id, read);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.markAllAsRead(userId);
  }

  async markAllAsReadByUserId(userId: string): Promise<void> {
    await this.repository.markAllAsReadByUserId(userId);
  }

  async deleteReadByUserId(userId: string): Promise<void> {
    await this.repository.deleteReadByUserId(userId);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.repository.deleteAllByUserId(userId);
  }
} 