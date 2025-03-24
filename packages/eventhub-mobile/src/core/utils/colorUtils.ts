import { ColorValue, ProcessedColorValue } from 'react-native';

/**
 * Obtiene el valor del color para usar en estilos de React Native
 * @param color Color a procesar
 * @returns Color procesado para usar en estilos
 */
export const getColorValue = (color: ColorValue | undefined | any): string => {
  if (!color) return '';
  
  // Si es un string, devolverlo como está
  if (typeof color === 'string') {
    return color;
  }
  
  // Manejar objetos de tema con propiedades anidadas como theme.colors.primary.main
  if (typeof color === 'object') {
    // Objetos de color con propiedad main
    if (color.main && typeof color.main === 'string') {
      return color.main;
    }
    
    // Objetos de color con propiedad default
    if (color.default && typeof color.default === 'string') {
      return color.default;
    }
    
    // Objetos de color con propiedad primary
    if (color.primary && typeof color.primary === 'string') {
      return color.primary;
    }
  }
  
  // Para objetos de tipo ProcessedColorValue que no se pueden convertir directamente
  return '#000000';
};

/**
 * Concatena un color con una cadena de opacidad hexadecimal
 * @param color Color base
 * @param opacity Opacidad en formato hexadecimal ('10', '20', etc.)
 * @returns Color con opacidad aplicada
 */
export const withOpacity = (color: string, opacity: string): string => {
  return color + opacity;
}; 