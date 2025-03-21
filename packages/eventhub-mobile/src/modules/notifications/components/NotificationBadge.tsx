import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../../theme';
import { notificationService } from '../../services/notification.service';

interface NotificationBadgeProps {
  onPressNotification?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  onPressNotification 
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadUnreadCount();

    // Podríamos añadir un interval para actualizar periódicamente
    const interval = setInterval(loadUnreadCount, 60000); // Cada minuto
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error al cargar conteo de notificaciones no leídas:', error);
    }
  };

  const handlePress = () => {
    if (onPressNotification) {
      onPressNotification();
    } else {
      router.push('/notifications');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
    >
      <FontAwesome name="bell-o" size={24} color={theme.colors.text.primary} />
      
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.error.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
}); 