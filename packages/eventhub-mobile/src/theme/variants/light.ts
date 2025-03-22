/**
 * Tema Claro
 * Definición de colores y estilos para el tema claro de la aplicación
 */

import { colors as baseColors } from '../base/colors';
import { shadows } from '../base/shadows';

// Colores específicos para el tema claro
export const lightColors = {
  // Colores principales
  primary: baseColors.primary,
  secondary: baseColors.secondary,
  success: baseColors.success,
  error: baseColors.error,
  warning: baseColors.warning,
  info: baseColors.info,
  grey: baseColors.grey,
  common: baseColors.common,
  
  // Colores de fondo y superficie
  background: {
    default: '#f9f9f9',
    paper: '#ffffff',
    card: '#ffffff',
    surface: '#ffffff',
    input: '#ffffff',
  },
  
  // Colores de estado
  status: {
    online: '#4cd964',
    offline: '#9E9E9E',
    busy: '#ff6b6b',
    away: '#ffcc00',
  },
  
  // Colores de texto
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#9E9E9E',
    hint: '#9E9E9E',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#333333',
    caption: '#757575',
    link: baseColors.primary.main,
  },
  
  // Colores de borde
  border: {
    light: '#eeeeee',
    main: '#dddddd',
    dark: '#bbbbbb',
    focus: baseColors.primary.main,
    input: '#dddddd',
    divider: '#eeeeee',
  },
  
  // Efectos y superposiciones
  effects: {
    ripple: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(0, 0, 0, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    shimmer: ['#f5f5f5', '#eaeaea', '#f5f5f5'],
  },
  
  // Sombras de color específico (para el tema claro)
  shadow: shadows.forColor('rgba(0, 0, 0, 0.1)', 'md'),
};

// Exportar el tema claro completo
export const lightTheme = {
  name: 'light',
  colors: lightColors,
  dark: false,
}; 