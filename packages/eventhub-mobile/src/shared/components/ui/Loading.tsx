import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

/**
 * Componente para mostrar indicador de carga con mensaje opcional
 */
export const Loading = ({
  size = 'large',
  color,
  message,
  fullScreen = false,
  style
}: LoadingProps) => {
  const { theme } = useTheme();
  
  // Usar el color proporcionado o el color primario del tema
  const indicatorColor = color || theme.colors.primary.main;
  
  return (
    <View style={[
      styles.container,
      fullScreen && styles.fullScreen,
      style
    ]}>
      <ActivityIndicator size={size} color={indicatorColor} />
      
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
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
}); 