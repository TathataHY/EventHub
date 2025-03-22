import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';

interface NotificationBadgeProps {
  count: number;
  small?: boolean;
  color?: string;
}

/**
 * Componente que muestra una insignia con el número de notificaciones no leídas
 */
export function NotificationBadge({ count, small = false, color }: NotificationBadgeProps) {
  const { theme } = useTheme();
  
  if (count <= 0) return null;
  
  // El color por defecto es el accent del tema
  const badgeColor = color || theme.colors.accent;
  
  // Si el contador es mayor a 99, mostrar 99+
  const displayCount = count > 99 ? '99+' : count.toString();
  
  return (
    <View 
      style={[
        styles.badge,
        { backgroundColor: badgeColor },
        small ? styles.badgeSmall : null
      ]}
    >
      <Text 
        style={[
          styles.badgeText,
          small ? styles.badgeTextSmall : null
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeSmall: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeTextSmall: {
    fontSize: 10,
  }
}); 