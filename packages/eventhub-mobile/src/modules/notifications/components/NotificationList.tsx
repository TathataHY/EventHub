import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Notification, NotificationResponse } from '@modules/notifications/services/notification.service';
import { NotificationItem } from './NotificationItem';
import { notificationService } from '@modules/notifications/services';
import { EmptyState } from '@shared/components/ui/EmptyState';
import { useTheme } from '@core/context/ThemeContext';

export const NotificationList: React.FC = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
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
      const success = await notificationService.markAsRead(notificationId);
      
      if (success) {
        // Actualizar la UI localmente para mostrar como leída
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
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
      onPress={() => handleMarkAsRead(item.id)} 
    />
  );

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
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
          colors={[theme.colors.primary.main]}
          tintColor={theme.colors.primary.main}
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