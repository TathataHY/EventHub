import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';
import { Notification } from '@modules/notifications/services/notification.service';
import { useFormatDate } from '@shared/hooks';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { theme } = useTheme();
  const { formatRelative } = useFormatDate();
  
  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: string): { name: string; color: string } => {
    switch (type) {
      case 'evento':
        return { name: 'calendar', color: '#FF5733' };
      case 'seguidor':
        return { name: 'person-add', color: '#33A8FF' };
      case 'comentario':
        return { name: 'chatbubble', color: '#33FF57' };
      case 'invitacion':
        return { name: 'mail', color: '#A833FF' };
      case 'sistema':
        return { name: 'information-circle', color: '#FFD700' };
      default:
        return { name: 'notifications', color: '#FF5733' };
    }
  };
  
  const iconInfo = getNotificationIcon(notification.type);
  
  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: notification.read ? theme.colors.background.default : theme.colors.background.card }
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconInfo.color + '20' }]}>
        <Ionicons name={iconInfo.name} size={24} color={iconInfo.color} />
      </View>
      
      <View style={styles.notificationContent}>
        <Text 
          style={[
            styles.notificationTitle, 
            { color: theme.colors.text.primary, fontWeight: notification.read ? '400' : '600' }
          ]}
        >
          {notification.title}
        </Text>
        
        <Text 
          style={[
            styles.notificationMessage, 
            { color: theme.colors.text.secondary }
          ]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
        
        <Text style={[styles.notificationDate, { color: theme.colors.text.secondary }]}>
          {formatRelative(notification.createdAt)}
        </Text>
      </View>
      
      {!notification.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5733',
    marginLeft: 8,
    alignSelf: 'center',
  },
}); 