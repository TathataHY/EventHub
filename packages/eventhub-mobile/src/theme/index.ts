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