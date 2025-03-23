import { TextStyle } from 'react-native';

/**
 * Helper para convertir estilos de tipografía a TextStyle válido para React Native
 * Este helper garantiza que los valores de fontWeight sean los esperados por RN
 */

// Función para convertir un fontWeight a uno de los valores aceptados por RN
export const convertFontWeight = (weight: string): TextStyle['fontWeight'] => {
  switch (weight) {
    case '100': return '100';
    case '200': return '200';
    case '300': return '300';
    case '400': return '400';
    case '500': return '500';
    case '600': return '600';
    case '700': return '700';
    case '800': return '800';
    case '900': return '900';
    case 'bold': return 'bold';
    case 'normal': return 'normal';
    default: return 'normal';
  }
};

// Función para convertir un estilo de tipografía completo
export const convertTypographyStyle = (style: any): TextStyle => {
  if (!style) return {};
  
  const { fontWeight, ...rest } = style;
  return {
    ...rest,
    fontWeight: fontWeight ? convertFontWeight(fontWeight) : 'normal'
  } as TextStyle;
}; 