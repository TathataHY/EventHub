import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { notificationService, Notification } from '../services/notification.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      setError('Error al cargar notificaciones');
      console.error('Error cargando notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar una notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
    }
  }, []);

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
    }
  }, []);

  // Eliminar una notificación (funcionalidad que podríamos añadir al servicio original si es necesario)
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // Si el servicio original no tiene esta función, podríamos implementarla
      // await notificationService.deleteNotification(notificationId);
      
      // Por ahora solo actualizamos el estado local
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  }, []);

  // Manejar la interacción con una notificación
  const handleNotificationPress = useCallback((notification: Notification) => {
    // Marcar como leída si no lo está
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navegar según el tipo y datos de la notificación
    if (notification.data?.eventId) {
      navigation.navigate('EventDetail' as never, { eventId: notification.data.eventId } as never);
    } else if (notification.data?.userId) {
      navigation.navigate('UserProfile' as never, { userId: notification.data.userId } as never);
    }
  }, [markAsRead, navigation]);

  // Obtener el conteo de notificaciones no leídas
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications,
    handleNotificationPress
  };
} 