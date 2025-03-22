/**
 * Sistema de tema para EventHub
 * 
 * Este archivo es el punto de entrada principal al sistema de tema
 * Proporciona acceso a todos los componentes del tema
 */

// Importar componentes base
import { colors } from './base/colors';
import { typography } from './base/typography';
import { spacing } from './base/spacing';
import { shadows } from './base/shadows';
import { AppColors, AppTypography, AppSpacing } from './theme.types';

// Importar variantes de tema
import { lightTheme } from './variants/light';
import { darkTheme } from './variants/dark';

// Definimos los radios de borde comunes
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * Crear un tema completo combinando todos los componentes
 */
const createTheme = (themeVariant: any): any => ({
  ...themeVariant,
  spacing,
  typography,
  shadows,
  borderRadius,
});

// Temas completos
const theme = createTheme(lightTheme);
const completeLightTheme = createTheme(lightTheme);
const completeDarkTheme = createTheme(darkTheme);

// Exponemos los colores base para uso directo
const baseColors = colors;

// Exportamos todo
export {
  baseColors,
  typography,
  spacing,
  shadows,
  lightTheme,
  darkTheme,
  borderRadius,
  theme,
  completeLightTheme,
  completeDarkTheme
};

// Exportar tema predeterminado (claro)
export default theme;

// Aliases para compatibilidad con código existente
export const appColors = colors;
export const appTypography = typography;
export const appSpacing = spacing;

// Tamaños de borde
export const appBorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Sombras
export const appShadows = {
  sm: {
    shadowColor: appColors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: appColors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: appColors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Exportamos elementos UI adicionales
export const appTheme = {
  colors: {
    ...appColors,
    divider: appColors.grey[300],
    accent: appColors.primary.main
  },
  typography: appTypography,
  spacing: appSpacing,
  borderRadius: appBorderRadius,
  shadows: appShadows,
};

// Exportamos tipos
export type {
  AppColors,
  AppTypography,
  AppSpacing
}; 