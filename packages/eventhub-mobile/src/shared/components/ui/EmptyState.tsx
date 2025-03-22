import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string; // Nombre del ícono de Ionicons
  iconColor?: string;
  image?: ImageSourcePropType;
  actionComponent?: React.ReactNode;
}

export function EmptyState({
  title,
  message,
  icon = 'alert-circle-outline',
  iconColor,
  image,
  actionComponent
}: EmptyStateProps) {
  const { theme } = useTheme();
  
  const defaultIconColor = iconColor || theme.colors.text.secondary;
  
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <Ionicons name={icon} size={80} color={defaultIconColor} />
      )}
      
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
        {message}
      </Text>
      
      {actionComponent && (
        <View style={styles.actionContainer}>
          {actionComponent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionContainer: {
    marginTop: 16,
  },
}); 