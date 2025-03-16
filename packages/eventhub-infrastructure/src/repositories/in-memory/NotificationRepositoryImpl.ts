import { Injectable } from '@nestjs/common';
import { NotificationRepository, Notification } from 'eventhub-domain';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  private notifications: Notification[] = [];

  async findById(id: string): Promise<Notification | null> {
    const notification = this.notifications.find(n => n.id === id);
    return notification ? this.clone(notification) : null;
  }

  async findByUserId(
    userId: string,
    filters?: { page?: number; limit?: number; read?: boolean }
  ): Promise<{ notifications: Notification[]; total: number }> {
    let filteredNotifications = this.notifications.filter(
      notification => notification.userId === userId
    );
    
    // Filtrar por estado de lectura si se especifica
    if (filters?.read !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        notification => notification.read === filters.read
      );
    }
    
    // Ordenar por fecha de creación descendente (más recientes primero)
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Aplicar paginación
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return {
      notifications: filteredNotifications
        .slice(startIndex, endIndex)
        .map(notification => this.clone(notification)),
      total: filteredNotifications.length
    };
  }

  async countUnread(userId: string): Promise<number> {
    return this.notifications.filter(
      notification => notification.userId === userId && !notification.read
    ).length;
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const notification = this.notifications.find(n => n.id === id);
    
    if (!notification) {
      return null;
    }
    
    notification.read = true;
    notification.updatedAt = new Date();
    
    return this.clone(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications
      .filter(notification => notification.userId === userId && !notification.read)
      .forEach(notification => {
        notification.read = true;
        notification.updatedAt = new Date();
      });
  }

  async save(notification: Notification): Promise<Notification> {
    const existingIndex = this.notifications.findIndex(n => n.id === notification.id);
    
    if (existingIndex >= 0) {
      // Actualizar notificación existente
      this.notifications[existingIndex] = this.clone(notification);
      return this.clone(notification);
    } else {
      // Crear nueva notificación
      const newNotification = this.clone(notification);
      this.notifications.push(newNotification);
      return newNotification;
    }
  }

  async delete(id: string): Promise<void> {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }

  // Método para clonar notificaciones y evitar mutaciones no deseadas
  private clone(notification: Notification): Notification {
    return new Notification(
      notification.id,
      notification.userId,
      notification.title,
      notification.message,
      notification.type,
      notification.read,
      notification.relatedEntityId,
      notification.relatedEntityType,
      notification.createdAt ? new Date(notification.createdAt) : undefined,
      notification.updatedAt ? new Date(notification.updatedAt) : undefined
    );
  }
} 