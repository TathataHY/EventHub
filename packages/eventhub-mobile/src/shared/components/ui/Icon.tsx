import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';

export interface IconProps {
  name: string;
  size?: number;
  color?: string | ColorValue;
  style?: any;
}

/**
 * Componente Icon que envuelve a Ionicons para evitar errores de tipo
 * en nombres de iconos que no están explícitamente tipados
 */
export const Icon = ({ name, size = 24, color = '#000', style }: IconProps) => {
  return (
    <Ionicons
      name={name as any}
      size={size}
      color={color}
      style={style}
    />
  );
}; 