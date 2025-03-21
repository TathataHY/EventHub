import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notification, NotificationType } from '../types';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@theme';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const navigation = useNavigation();
  
  // Obtener color e icono basado en el tipo de notificación
  const getNotificationIconAndColor = () => {
    switch (notification.type) {
      case NotificationType.EVENT_INVITE:
        return { icon: 'mail', color: colors.primary };
      case NotificationType.EVENT_REMINDER:
        return { icon: 'alarm', color: colors.warning };
      case NotificationType.EVENT_UPDATE:
        return { icon: 'refresh', color: colors.info };
      case NotificationType.EVENT_CANCELLED:
        return { icon: 'close-circle', color: colors.danger };
      case NotificationType.NEW_COMMENT:
        return { icon: 'chatbubble', color: colors.success };
      case NotificationType.FRIEND_ATTENDING:
        return { icon: 'people', color: colors.secondary };
      case NotificationType.SYSTEM_NOTIFICATION:
      default:
        return { icon: 'information-circle', color: colors.gray };
    }
  };

  const { icon, color } = getNotificationIconAndColor();

  // Formatear la fecha de creación
  const formattedDate = format(
    new Date(notification.createdAt),
    'dd MMM, HH:mm',
    { locale: es }
  );

  // Manejar el tap en una notificación
  const handleNotificationPress = () => {
    // Marcar como leída
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // Navegar basado en el tipo de notificación
    if (notification.data?.eventId) {
      navigation.navigate('EventDetail', { eventId: notification.data.eventId });
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer
      ]}
      onPress={handleNotificationPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      {!notification.isRead && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: '#f8f9ff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
}); 