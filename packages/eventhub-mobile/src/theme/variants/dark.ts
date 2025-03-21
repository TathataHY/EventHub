/**
 * Tema Oscuro
 * Definición de colores y estilos para el tema oscuro de la aplicación
 */

import { colors as baseColors } from '../base/colors';
import { shadows } from '../base/shadows';

// Colores específicos para el tema oscuro
export const darkColors = {
  // Colores principales (ligeramente ajustados para el tema oscuro)
  primary: {
    ...baseColors.primary,
    main: '#6E98FF',   // Versión más brillante para tema oscuro
    light: '#9FBDFF',
    dark: '#3A69D2',
    lightest: '#222D46',
  },
  
  secondary: {
    ...baseColors.secondary,
    main: '#FF8A8A',   // Versión más brillante para tema oscuro
    light: '#FFAEAE',
    dark: '#CC5858',
    lightest: '#462222',
  },
  
  // Colores de estado (ajustados para mejor visibilidad en fondo oscuro)
  success: {
    ...baseColors.success,
    main: '#5BEA75',
    light: '#8FF0A4',
    dark: '#30B04B',
    lightest: '#22462B',
  },
  
  error: {
    ...baseColors.error,
    main: '#F16357',
    light: '#F48D84',
    dark: '#C04132',
    lightest: '#462225',
  },
  
  warning: {
    ...baseColors.warning,
    main: '#FFD633',
    light: '#FFE066',
    dark: '#CCAC00',
    lightest: '#463D22',
  },
  
  info: {
    ...baseColors.info,
    main: '#70BFFD',
    light: '#9CD5FE',
    dark: '#4A90D4',
    lightest: '#223646',
  },
  
  // Escala de grises invertida para tema oscuro
  grey: {
    50: '#1e1e1e',
    100: '#2d2d2d',
    200: '#333333',
    300: '#444444',
    400: '#666666',
    500: '#888888',
    600: '#aaaaaa',
    700: '#cccccc',
    800: '#e0e0e0',
    900: '#f5f5f5',
  },
  
  // Colores comunes
  common: baseColors.common,
  
  // Colores de fondo y superficie
  background: {
    default: '#121212',
    paper: '#1e1e1e',
    card: '#252525',
    surface: '#2d2d2d',
    input: '#333333',
  },
  
  // Colores de estado
  status: {
    online: '#5BEA75',
    offline: '#666666',
    busy: '#F16357',
    away: '#FFD633',
  },
  
  // Colores de texto
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#707070',
    hint: '#909090',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#ffffff',
    caption: '#b0b0b0',
    link: '#70BFFD',
  },
  
  // Colores de borde
  border: {
    light: '#444444',
    main: '#555555',
    dark: '#666666',
    focus: '#6E98FF',
    input: '#444444',
    divider: '#333333',
  },
  
  // Efectos y superposiciones
  effects: {
    ripple: 'rgba(255, 255, 255, 0.12)',
    hover: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    shimmer: ['#222222', '#333333', '#222222'],
  },
  
  // Sombras de color específico (para el tema oscuro)
  shadow: shadows.forColor('rgba(0, 0, 0, 0.5)', 'md'),
};

// Exportar el tema oscuro completo
export const darkTheme = {
  name: 'dark',
  colors: darkColors,
  dark: true,
}; 