import { apiService } from './api.service';

// Interfaces
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface NotificationSearchParams {
  page?: number;
  limit?: number;
  read?: boolean;
}

class NotificationService {
  // Obtener todas las notificaciones del usuario
  async getNotifications(params?: NotificationSearchParams) {
    try {
      return await apiService.get('/notifications', { params });
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  // Obtener notificaciones no leídas
  async getUnreadNotifications() {
    try {
      return await apiService.get('/notifications', { params: { read: false } });
    } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      throw error;
    }
  }

  // Marcar una notificación como leída
  async markAsRead(id: string) {
    try {
      return await apiService.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error(`Error al marcar notificación ${id} como leída:`, error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    try {
      return await apiService.put('/notifications/read-all');
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  // Eliminar una notificación
  async deleteNotification(id: string) {
    try {
      return await apiService.delete(`/notifications/${id}`);
    } catch (error) {
      console.error(`Error al eliminar notificación ${id}:`, error);
      throw error;
    }
  }

  // Obtener preferencias de notificación
  async getNotificationPreferences() {
    try {
      return await apiService.get('/notification-preferences');
    } catch (error) {
      console.error('Error al obtener preferencias de notificación:', error);
      throw error;
    }
  }

  // Actualizar preferencias de notificación
  async updateNotificationPreferences(preferences: any) {
    try {
      return await apiService.put('/notification-preferences', preferences);
    } catch (error) {
      console.error('Error al actualizar preferencias de notificación:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export const notificationService = new NotificationService(); 