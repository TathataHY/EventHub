import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Badge } from './Badge';

export interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  maxCount?: number;
}

/**
 * Componente que muestra un contador de notificaciones
 */
export const NotificationBadge = ({
  count,
  size = 'medium',
  maxCount = 99,
}: NotificationBadgeProps) => {
  const { theme } = useTheme();
  
  if (count <= 0) return null;
  
  // Determinar el tamaño del componente basado en la prop
  const getBadgeSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      case 'medium':
      default: return 20;
    }
  };
  
  // Determinar el tamaño de fuente basado en la prop
  const getFontSize = () => {
    switch (size) {
      case 'small': return 8;
      case 'large': return 12;
      case 'medium':
      default: return 10;
    }
  };
  
  // Formatear el conteo
  const getFormattedCount = () => {
    if (count > maxCount) {
      return `${maxCount}+`;
    }
    return `${count}`;
  };
  
  return (
    <Badge
      content={getFormattedCount()}
      color={theme.colors.error.main}
      size={getBadgeSize()}
      textColor="#FFFFFF"
      max={maxCount}
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4848',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 