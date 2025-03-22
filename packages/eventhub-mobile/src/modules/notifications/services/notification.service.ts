import { apiClient } from '@core/api';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { eventService } from '@modules/events/services/event.service';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

export interface NotificationEvent {
  id: string;
  title: string;
  body: string;
  data?: any;
  trigger?: {
    seconds?: number;
    date?: Date;
  };
}

export interface NotificationResponse {
  data: Notification[];
  count: number;
  unreadCount: number;
}

class NotificationService {
  /**
   * Obtiene todas las notificaciones del usuario
   */
  async getNotifications(): Promise<NotificationResponse> {
    try {
      const response = await apiClient.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      // Para evitar errores en desarrollo si no hay API
      // Devolvemos datos simulados
      return {
        data: [
          {
            id: '1',
            userId: '1',
            type: 'event',
            title: '¡Tu evento está cerca!',
            message: 'El Festival de Música comienza mañana',
            createdAt: new Date().toISOString(),
            read: false,
            data: { eventId: '1' }
          },
          {
            id: '2',
            userId: '1',
            type: 'event',
            title: '¡Tu evento comienza pronto!',
            message: 'La Conferencia de Tecnología comienza en 1 hora',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            read: true,
            data: { eventId: '2' }
          },
          {
            id: '3',
            userId: '1',
            type: 'update',
            title: 'Actualización de evento',
            message: 'El horario del Taller de Programación ha cambiado',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            read: false,
            data: { eventId: '3' }
          }
        ],
        count: 3,
        unreadCount: 2
      };
    }
  }

  /**
   * Marca una notificación como leída
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      // En desarrollo, simulamos éxito
      return true;
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      await apiClient.put('/notifications/read-all');
      return true;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      // En desarrollo, simulamos éxito
      return true;
    }
  }

  /**
   * Obtiene el número de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Error al obtener conteo de notificaciones no leídas:', error);
      // Para simulación, obtenemos todas y filtramos
      const notifications = await this.getNotifications();
      return notifications.unreadCount;
    }
  }

  // Obtener preferencias de notificación
  async getNotificationPreferences() {
    try {
      return await apiClient.get('/notification-preferences');
    } catch (error) {
      console.error('Error al obtener preferencias de notificación:', error);
      throw error;
    }
  }

  // Actualizar preferencias de notificación
  async updateNotificationPreferences(preferences: any) {
    try {
      return await apiClient.put('/notification-preferences', preferences);
    } catch (error) {
      console.error('Error al actualizar preferencias de notificación:', error);
      throw error;
    }
  }

  /**
   * Solicita permisos para enviar notificaciones
   */
  async requestPermissions() {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    return true;
  }

  /**
   * Programa una notificación para un evento
   */
  async scheduleEventNotification(eventId: string, eventTitle: string, eventDate: Date) {
    try {
      // Calcular tiempo hasta el evento
      const now = new Date();
      const timeUntilEvent = eventDate.getTime() - now.getTime();
      
      // Si el evento ya pasó, no programar notificación
      if (timeUntilEvent <= 0) {
        return;
      }

      // Programar notificación 24 horas antes
      const oneDayBefore = new Date(eventDate);
      oneDayBefore.setHours(oneDayBefore.getHours() - 24);
      
      if (oneDayBefore > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '¡Tu evento está cerca!',
            body: `${eventTitle} comienza mañana`,
            data: { eventId },
          },
          trigger: {
            date: oneDayBefore,
          },
        });
      }

      // Programar notificación 1 hora antes
      const oneHourBefore = new Date(eventDate);
      oneHourBefore.setHours(oneHourBefore.getHours() - 1);
      
      if (oneHourBefore > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '¡Tu evento comienza pronto!',
            body: `${eventTitle} comienza en 1 hora`,
            data: { eventId },
          },
          trigger: {
            date: oneHourBefore,
          },
        });
      }

      return true;
    } catch (error) {
      console.error('Error al programar notificación:', error);
      return false;
    }
  }

  /**
   * Cancela todas las notificaciones programadas
   */
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Cancela las notificaciones de un evento específico
   */
  async cancelEventNotifications(eventId: string) {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const eventNotifications = scheduledNotifications.filter(
      (notification: any) => notification.content.data?.eventId === eventId
    );

    for (const notification of eventNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  /**
   * Obtiene el token de notificación del dispositivo
   */
  async getExpoPushToken() {
    if (!Device.isDevice) {
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Reemplazar con tu ID de proyecto Expo
      });

      return tokenData.data;
    } catch (error) {
      console.error('Error al obtener token de notificaciones:', error);
      return null;
    }
  }

  /**
   * Configura los listeners para notificaciones
   * @returns {{
   *  unsubscribe: () => void
   * }} Función para desuscribirse
   */
  setupNotificationListeners(onNotificationReceived: (notification: any) => void) {
    // Cuando la app está en primer plano
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification: any) => onNotificationReceived(notification)
    );
    
    // Cuando el usuario interactúa con una notificación
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const { notification } = response;
      onNotificationReceived(notification);
    });

    return {
      unsubscribe: () => {
        foregroundSubscription.remove();
        responseSubscription.remove();
      }
    };
  }
}

// Exportar una instancia única del servicio
export const notificationService = new NotificationService(); 