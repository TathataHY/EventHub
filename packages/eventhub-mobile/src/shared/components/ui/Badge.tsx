import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from './Text';

interface BadgeProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const badgeStyles = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
  ];

  return (
    <View style={badgeStyles}>
      {label && <Text style={textStyles}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  success: {
    backgroundColor: '#34C759',
  },
  error: {
    backgroundColor: '#FF3B30',
  },
  warning: {
    backgroundColor: '#FF9500',
  },
  info: {
    backgroundColor: '#64D2FF',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 12,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
}); 