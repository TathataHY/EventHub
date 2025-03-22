import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: theme.colors.background.card,
        borderBottomColor: theme.colors.border.divider
      }
    ]}>
      <Text style={[
        styles.title, 
        { color: theme.colors.text.primary }
      ]}>
        Notificaciones
      </Text>
      
      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.markAsReadButton}
          onPress={onMarkAllAsRead}
        >
          <Ionicons 
            name="checkmark-done" 
            size={22} 
            color={theme.colors.primary.main} 
          />
          <Text style={[
            styles.markAsReadText, 
            { color: theme.colors.primary.main }
          ]}>
            Marcar todo como leído
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  markAsReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAsReadText: {
    fontSize: 14,
    marginLeft: 4,
  },
}); 