import { ColorValue } from 'react-native';

// Interfaz para colores primarios/secundarios
export interface ThemeColorSet {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
  lightest: string;
}

// Interfaz para la paleta de grises
export interface GreyScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// Interfaz para colores comunes
export interface CommonColors {
  black: string;
  white: string;
  transparent: string;
}

// Interfaz para toda la estructura de colores de la aplicación
export interface AppColors {
  primary: ThemeColorSet;
  secondary: ThemeColorSet;
  success: ThemeColorSet;
  error: ThemeColorSet;
  warning: ThemeColorSet;
  info: ThemeColorSet;
  grey: GreyScale;
  common: CommonColors;
  text: string;
  background: string;
  divider: string;
  accent: string;
}

/**
 * Tipo para tipografía
 */
export interface AppTypography {
  h1: any;
  h2: any;
  h3: any;
  h4: any;
  h5: any;
  h6: any;
  subtitle1: any;
  subtitle2: any;
  body1: any;
  body2: any;
  button1: any;
  button2: any;
  caption: any;
  overline: any;
}

/**
 * Tipo para espaciado
 */
export interface AppSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Tema completo de la aplicación
 */
export interface Theme {
  colors: AppColors;
  typography: AppTypography;
  spacing: AppSpacing;
  isDark: boolean;
} 