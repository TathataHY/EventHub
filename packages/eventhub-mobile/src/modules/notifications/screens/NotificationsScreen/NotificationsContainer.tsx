import React from 'react';
import { useNotifications } from '../../hooks';
import { NotificationsPresenter } from './NotificationsPresenter';

/**
 * Contenedor para la pantalla de notificaciones
 * Maneja la lógica de negocio y proporciona datos al presentador
 */
export function NotificationsContainer() {
  const {
    notifications,
    loading,
    unreadCount,
    markAllAsRead,
    refreshNotifications,
    handleNotificationPress
  } = useNotifications();

  return (
    <NotificationsPresenter 
      notifications={notifications}
      loading={loading}
      unreadCount={unreadCount}
      onMarkAllAsRead={markAllAsRead}
      onRefresh={refreshNotifications}
      onNotificationPress={handleNotificationPress}
    />
  );
} 