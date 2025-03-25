import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Icon } from './Icon';

export interface EmptyStateProps {
  icon: string;
  title: string;
  message?: string;
  containerStyle?: ViewStyle;
  actionText?: string;
  onAction?: () => void;
}

/**
 * Componente para mostrar un estado vacío en listas y secciones
 */
export const EmptyState = ({ 
  icon, 
  title, 
  message, 
  containerStyle,
  actionText,
  onAction
}: EmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <Icon 
        name={icon} 
        size={64} 
        color={theme.colors.secondary.main} 
      />
      <Text style={[
        styles.title, 
        { color: theme.colors.text.primary }
      ]}>
        {title}
      </Text>
      {message && (
        <Text style={[
          styles.message, 
          { color: theme.colors.text.secondary }
        ]}>
          {message}
        </Text>
      )}
      
      {actionText && onAction && (
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { backgroundColor: theme.colors.primary.main }
          ]} 
          onPress={onAction}
        >
          <Text style={[
            styles.actionText, 
            { color: theme.colors.primary.contrastText }
          ]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  actionButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 