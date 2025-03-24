import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Notification } from '@modules/notifications/services/notification.service';
import { useFormatDate } from '@shared/hooks';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { theme } = useTheme();
  const { formatRelative } = useFormatDate();
  
  // Determinar el icono y el color basado en el tipo de notificación
  const getIconProps = (type: string) => {
    switch (type) {
      case 'event':
        return { name: 'calendar', color: theme.colors.primary.main };
      case 'announcement':
        return { name: 'megaphone', color: theme.colors.info.main };
      case 'update':
        return { name: 'refresh', color: theme.colors.success.main };
      case 'alert':
        return { name: 'alert-circle', color: theme.colors.error.main };
      case 'achievement':
        return { name: 'trophy', color: theme.colors.warning.main };
      default:
        return { name: 'notifications', color: theme.colors.text.secondary };
    }
  };

  const { name, color } = getIconProps(notification.type);
  const formattedDate = format(new Date(notification.createdAt), 'dd MMM, HH:mm', { locale: es });
  
  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: notification.read ? theme.colors.background.default : `${theme.colors.primary.light}15` }
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={name as any} size={24} color={color} />
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
          {formattedDate}
        </Text>
      </View>
      
      {!notification.read && <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary.main }]} />}
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
    marginLeft: 8,
    alignSelf: 'center',
  },
}); 