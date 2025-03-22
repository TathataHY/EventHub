/**
 * Tipo para colores de tema
 */
export interface AppColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  text: string;
  textDark: string;
  textLight: string;
  gray: {
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
  };
  white: string;
  black: string;
  transparent: string;
  card: string;
  border: string;
  divider: string;
  accent: string;
  danger: string;
}

/**
 * Tipo para tipografía
 */
export interface AppTypography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  subtitle1: TextStyle;
  subtitle2: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  button1: TextStyle;
  button2: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
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
 * Estilo de texto
 */
interface TextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontFamily?: string;
  letterSpacing?: number;
} 