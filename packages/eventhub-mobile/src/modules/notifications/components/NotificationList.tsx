import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Notification } from '../types';
import { NotificationItem } from './NotificationItem';
import { notificationService } from '../services';
import { EmptyState } from '@core/components';
import { colors } from '@core/theme';

export const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Manejar refresco al tirar hacia abajo
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  // Manejar marcar como leída
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = await notificationService.markAsRead({ notificationId });
      
      if (success) {
        // Actualizar la UI localmente para mostrar como leída
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  }, []);

  // Renderizar un elemento de la lista
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationItem 
      notification={item} 
      onMarkAsRead={handleMarkAsRead} 
    />
  );

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Estado vacío
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon="notifications-off-outline"
        title="No tienes notificaciones"
        message="Las notificaciones de eventos y actividades aparecerán aquí"
      />
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 