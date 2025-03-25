import React from 'react';
import { View, Text, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type BadgeVariant = 'standard' | 'dot';
type BadgeSize = 'small' | 'medium' | 'large' | number;
type FontWeightType = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
type BadgeColor = string;

export interface BadgeProps {
  content?: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  textColor?: string;
  visible?: boolean;
  style?: ViewStyle;
  max?: number;
}

/**
 * Componente Badge para mostrar indicadores numéricos o de estado
 */
export const Badge = ({
  content,
  variant = 'standard',
  size = 'medium',
  color,
  textColor = '#FFFFFF',
  visible = true,
  style,
  max = 99
}: BadgeProps) => {
  const { theme, getColorValue } = useTheme();
  const { width, height } = useWindowDimensions();
  
  if (!visible) return null;
  
  // Determinar el tamaño real en función del size prop
  const getBadgeSize = (): number => {
    const baseSizes = {
      small: 16,
      medium: 24,
      large: 32
    };
    
    // Si es un valor numérico, usarlo directamente
    if (typeof size === 'number') {
      return size;
    }
    
    // Si es una cadena predefinida, usar el valor correspondiente
    return baseSizes[size || 'medium'];
  };
  
  // Calcular el tamaño de la fuente
  const fontSize = (getBadgeSize() * 0.6);
  
  // Determinar color
  const getColor = (colorPath: any) => {
    return getColorValue ? getColorValue(colorPath) : String(colorPath);
  };
  
  const badgeColor = color || getColor(theme.colors.primary.main);
  
  // Formatear contenido si es número
  const getContent = () => {
    if (typeof content === 'number' && content > max) {
      return `${max}+`;
    }
    return content;
  };
  
  // Renderizar variante de punto (solo un círculo)
  if (variant === 'dot') {
    const dotSize = getBadgeSize() / 2;
    
    return (
      <View style={[
        styles.dot,
        { 
          width: dotSize, 
          height: dotSize, 
          borderRadius: dotSize / 2,
          backgroundColor: badgeColor
        },
        style
      ]} />
    );
  }
  
  // Renderizar variante estándar (con texto)
  const badgeSize = getBadgeSize();
  
  return (
    <View style={[
      styles.badge,
      { 
        minWidth: badgeSize,
        height: badgeSize,
        borderRadius: badgeSize / 2,
        backgroundColor: badgeColor 
      },
      style
    ]}>
      <Text style={[
        styles.text,
        { 
          fontSize, 
          color: textColor,
          fontWeight: '600' as FontWeightType
        }
      ]}>
        {getContent()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold' as FontWeightType,
    includeFontPadding: false,
    paddingTop: 1,
  }
}); 