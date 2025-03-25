import { ColorValue } from 'react-native';
import { ThemeColorSet } from '../../theme/theme.types';

/**
 * Convierte cualquier tipo de color del tema a un tipo ColorValue compatible con React Native
 * Soluciona problemas de tipado cuando el color es un objeto complejo en lugar de un string simple
 */
export const getColorValue = (color: ThemeColorSet | string | any): ColorValue => {
  // Si el color ya es un string, devolverlo directamente
  if (typeof color === 'string') {
    return color;
  }
  
  // Si el color es un objeto complejo con una propiedad 'main'
  if (color && typeof color === 'object' && 'main' in color) {
    return color.main;
  }
  
  // Si es un objeto con propiedades específicas como 'primary', intentar extraer un valor
  if (color && typeof color === 'object' && ('primary' in color || 'default' in color)) {
    if ('primary' in color) return getColorValue(color.primary);
    if ('default' in color) return getColorValue(color.default);
  }
  
  // Valores por defecto para casos no manejados
  console.warn('No se pudo convertir el color a un tipo ColorValue válido:', color);
  return '#000000';
};

/**
 * Versión específica para colores de iconos (compatible con Expo/Vector Icons)
 */
export const getIconColor = (color: any): string => {
  const colorValue = getColorValue(color);
  // Asegurar que el resultado sea un string
  return typeof colorValue === 'string' ? colorValue : '#000000';
};

/**
 * Utilidad para obtener el color de categoría correctamente tipado
 */
export const getCategoryColor = (categoria: string, theme: any): ColorValue => {
  let colorKey: string;
  
  switch (categoria?.toLowerCase()) {
    case 'música':
    case 'musica':
      colorKey = 'primary';
      break;
    case 'tecnología':
    case 'tecnologia':
      colorKey = 'secondary';
      break;
    case 'deporte':
    case 'deportes':
      colorKey = 'success';
      break;
    case 'arte':
    case 'cultura':
      colorKey = 'warning';
      break;
    case 'negocios':
    case 'business':
      colorKey = 'info';
      break;
    case 'gastronomía':
    case 'gastronomia':
    case 'comida':
      colorKey = 'dark';
      break;
    default:
      colorKey = 'primary';
  }
  
  // Intentar obtener el color del tema si existe
  const themeColor = theme.colors?.[colorKey];
  return getColorValue(themeColor);
}; 