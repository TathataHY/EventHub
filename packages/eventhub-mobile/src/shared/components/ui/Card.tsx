import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

export interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevation?: number;
  outlined?: boolean;
}

/**
 * Componente Card para mostrar contenido en una tarjeta con sombra
 */
export const Card = ({
  children,
  style,
  elevation = 2,
  outlined = false
}: CardProps) => {
  const { theme, getColorValue } = useTheme();
  
  // Determinar color
  const getColor = (colorPath: any) => {
    return getColorValue ? getColorValue(colorPath) : String(colorPath);
  };
  
  // Calcular estilos combinados
  const cardStyle = {
    ...styles.card,
    backgroundColor: getColor(theme.colors.background.default),
    borderColor: outlined ? getColor(theme.colors.grey[300]) : 'transparent',
    borderWidth: outlined ? 1 : 0,
    elevation: elevation,
    ...style
  };
  
  return (
    <View style={[cardStyle]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    borderWidth: 1,
  },
}); 