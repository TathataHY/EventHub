/**
 * Archivo de exportación unificado para el tema
 * Este archivo centraliza las exportaciones relacionadas con el tema para facilitar las importaciones
 */

// Exportar el contexto de tema
export { useTheme, ThemeProvider, ThemeMode } from './context/ThemeContext';

// Exportar variantes de tema
export { lightTheme } from '../theme/variants/light';
export { darkTheme } from '../theme/variants/dark';

// Exportar utilidades de color
export { getColorValue, getIconColor, getCategoryColor } from '../shared/utils/color.utils';

// Exportación por defecto para compatibilidad
import { lightTheme } from '../theme/variants/light';
export default lightTheme; 