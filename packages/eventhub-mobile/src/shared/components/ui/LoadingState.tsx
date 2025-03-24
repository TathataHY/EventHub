import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

export interface LoadingStateProps {
  message?: string;
  containerStyle?: ViewStyle;
}

export const LoadingState = ({ 
  message = 'Cargando...', 
  containerStyle 
}: LoadingStateProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary.main} 
      />
      {message && (
        <Text style={[
          styles.message, 
          { color: theme.colors.text.secondary }
        ]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
}); 