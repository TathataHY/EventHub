import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
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
  
  if (!visible) return null;
  
  // Convertir tamaños preestablecidos a números
  const getBadgeSize = (): number => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20; // medium
    }
  };
  
  // Formatear contenido si es número
  const getContent = () => {
    if (typeof content === 'number' && content > max) {
      return `${max}+`;
    }
    return content;
  };
  
  // Usar color predeterminado si no se proporciona
  const badgeColor = color || getColorValue(theme.colors.primary.main);
  
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
  const fontSize = badgeSize * 0.6;
  
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