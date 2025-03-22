/**
 * Definición de colores base para la aplicación
 * Este archivo contiene las definiciones de color fundamentales que serán utilizadas
 * para construir las variantes de tema (claro/oscuro)
 */

// Colores primarios
export const primaryColors = {
  main: '#4a80f5',     // Azul principal
  light: '#7da3f8',    // Versión más clara
  dark: '#3a62be',     // Versión más oscura
  contrastText: '#ffffff', // Texto sobre fondo primario
  lightest: '#eef4ff', // Versión muy clara para fondos
};

// Colores secundarios
export const secondaryColors = {
  main: '#ff6b6b',     // Rojo/coral principal
  light: '#ff9797',    // Versión más clara
  dark: '#d44a4a',     // Versión más oscura
  contrastText: '#ffffff', // Texto sobre fondo secundario
  lightest: '#fff2f2', // Versión muy clara para fondos
};

// Colores de estado
export const statusColors = {
  success: {
    main: '#4cd964',     // Verde principal
    light: '#7ee491',    // Versión más clara
    dark: '#33a048',     // Versión más oscura
    contrastText: '#ffffff', // Texto sobre fondo de éxito
    lightest: '#efffef', // Versión muy clara para fondos
  },
  error: {
    main: '#e74c3c',     // Rojo principal
    light: '#f07a6e',    // Versión más clara
    dark: '#c0392b',     // Versión más oscura
    contrastText: '#ffffff', // Texto sobre fondo de error
    lightest: '#fdeeec', // Versión muy clara para fondos
  },
  warning: {
    main: '#ffcc00',     // Amarillo principal
    light: '#ffdb4d',    // Versión más clara
    dark: '#cca300',     // Versión más oscura
    contrastText: '#000000', // Texto sobre fondo de advertencia
    lightest: '#fffbeb', // Versión muy clara para fondos
  },
  info: {
    main: '#64b5f6',     // Azul claro principal
    light: '#91cfff',    // Versión más clara
    dark: '#4a90d4',     // Versión más oscura
    contrastText: '#ffffff', // Texto sobre fondo de información
    lightest: '#edf7ff', // Versión muy clara para fondos
  },
};

// Escala de grises (neutrales)
export const greyScale = {
  50: '#fafafa',  // Casi blanco
  100: '#f5f5f5', // Muy claro
  200: '#eeeeee', // Claro
  300: '#dddddd', // Medio claro
  400: '#cccccc', // Medio
  500: '#999999', // Medio oscuro
  600: '#777777', // Oscuro
  700: '#666666', // Más oscuro
  800: '#444444', // Muy oscuro
  900: '#333333', // Casi negro
};

// Colores comunes
export const commonColors = {
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
};

// Colores de UI básicos
export const uiColors = {
  text: '#333333',       // Color de texto principal
  background: '#ffffff', // Color de fondo principal
  divider: '#dddddd',    // Color para divisores
  accent: '#4a80f5',     // Color de acento (igual al primario por defecto)
};

// Exportamos todos los colores
export const colors = {
  primary: primaryColors,
  secondary: secondaryColors,
  ...statusColors,
  grey: greyScale,
  common: commonColors,
  ...uiColors,
}; 