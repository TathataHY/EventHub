/**
 * Configuración central de la aplicación
 * Este módulo conecta todos los componentes principales
 */

// Exportación de módulos principales
export * from '../modules';
export * from '../shared';
export * from '../core';

// Exportar los elementos del tema explícitamente para evitar conflictos
import { ThemeProvider, useTheme } from '../core/context/ThemeContext';
import { appColors, appTheme, appTypography, appSpacing, convertTypographyStyle } from '../theme';
export { ThemeProvider, useTheme, appColors, appTheme, appTypography, appSpacing, convertTypographyStyle };

/**
 * Módulo principal de la aplicación
 * Define la estructura general y la configuración de la aplicación
 */

// Exportar el proveedor principal
export * from './AppProvider';

// Exportar componentes específicos de la aplicación
// export * from './components'; 