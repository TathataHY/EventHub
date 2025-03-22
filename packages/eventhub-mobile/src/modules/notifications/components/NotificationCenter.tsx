import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@core/context/ThemeContext';
import { notificationService, Notification } from '@modules/notifications/services/notification.service';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Marcar como leída
      if (!notification.read) {
        await notificationService.markAsRead(notification.id);
        
        // Actualizar estado local
        setNotifications(prevNotifications =>
          prevNotifications.map(item =>
            item.id === notification.id
              ? { ...item, read: true }
              : item
          )
        );
      }
      
      // Navegar al evento si tiene eventId
      if (notification.data?.eventId) {
        router.push(`/events/evento/${notification.data.eventId}`);
      }
    } catch (error) {
      console.error('Error al procesar notificación:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      Alert.alert('Éxito', 'Todas las notificaciones han sido marcadas como leídas');
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      Alert.alert('Error', 'No se pudieron marcar todas las notificaciones como leídas');
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && { backgroundColor: theme.colors.primary.light }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text.primary }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationBody, { color: theme.colors.text.secondary }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.colors.text.secondary }]}>
          {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary.main }]} />
      )}
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando notificaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      {notifications.length > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={[styles.markAllText, { color: theme.colors.primary.main }]}>
            Marcar todas como leídas
          </Text>
        </TouchableOpacity>
      )}
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bell-o" size={48} color={theme.colors.text.secondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No hay notificaciones
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    alignSelf: 'center',
  },
  markAllButton: {
    alignSelf: 'flex-end',
    padding: 8,
    margin: 16,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 