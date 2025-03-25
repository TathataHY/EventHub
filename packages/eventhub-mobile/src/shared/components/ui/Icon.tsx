import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ColorValue, View, StyleSheet } from 'react-native';

export interface IconProps {
  name: string;
  size?: number;
  color?: string | ColorValue;
  style?: any;
}

/**
 * Componente Icon que envuelve a Ionicons para evitar errores de tipo
 * en nombres de iconos que no están explícitamente tipados.
 * Incluye un fallback para cuando el icono no se puede cargar.
 */
export const Icon = ({ name, size = 24, color = '#000', style }: IconProps) => {
  // Implementación con manejo de errores
  try {
    return (
      <Ionicons
        name={name as any}
        size={size}
        color={color}
        style={style}
      />
    );
  } catch (error) {
    // Si hay error al renderizar el icono, mostramos un placeholder
    console.warn(`Error al cargar el icono ${name}:`, error);
    return (
      <View 
        style={[
          styles.iconPlaceholder, 
          { width: size, height: size, borderRadius: size/2 },
          { backgroundColor: typeof color === 'string' ? color : '#000' },
          style
        ]} 
      />
    );
  }
};

const styles = StyleSheet.create({
  iconPlaceholder: {
    opacity: 0.7
  }
}); 