import { useContext } from 'react';
import { ColorValue } from 'react-native';
import React from 'react';

/**
 * Estructura mínima esperada para el tema
 */
export interface Theme {
  colors: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    error: {
      main: string;
    };
    success: {
      main: string;
    };
    warning: {
      main: string;
    };
    info: {
      main: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    grey: {
      [key: number]: string;
    };
    background: {
      default: string;
    };
  };
}

// Tema predeterminado para cuando useContext no proporciona un tema
const defaultTheme: Theme = {
  colors: {
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    grey: {
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
    },
    background: {
      default: '#ffffff',
    },
  },
};

// Creamos un contexto simple para soportar la implementación
export const ThemeContext = React.createContext<Theme>(defaultTheme);

/**
 * Hook para acceder al tema actual y utilidades relacionadas con colores
 */
export const useTheme = () => {
  // Usamos un try-catch para manejar casos donde useContext falla
  let theme: Theme;
  try {
    const contextTheme = useContext(ThemeContext);
    theme = contextTheme || defaultTheme;
  } catch (error) {
    console.warn('Error al acceder al contexto de tema, usando tema predeterminado', error);
    theme = defaultTheme;
  }

  /**
   * Obtiene el valor de color desde la ruta especificada
   * Ejemplo: getColorValue(theme.colors.primary.main)
   */
  const getColorValue = (colorOrPath: string | ColorValue): string => {
    if (!colorOrPath) return '#000000';
    
    if (typeof colorOrPath === 'string') {
      return colorOrPath;
    }
    
    // Si es un objeto ColorValue, convertirlo a string
    return String(colorOrPath);
  };

  // Devolvemos el tema y las utilidades
  return {
    theme,
    getColorValue,
  };
}; 