import { useContext } from 'react';
import { ColorValue } from 'react-native';
import React from 'react';
import { ThemeContext, ThemeContextType } from '@core/context/ThemeContext';
import { lightTheme } from '../../theme/variants/light';

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

// Hook para acceder al tema actual y a las funciones para modificarlo
export const useTheme = () => {
  return useContext(ThemeContext);
};

/**
 * Hook para acceder al tema actual y utilidades relacionadas con colores
 */
export const useThemeColor = () => {
  // Usamos un try-catch para manejar casos donde useContext falla
  let themeContext: ThemeContextType;
  try {
    themeContext = useContext(ThemeContext);
  } catch (error) {
    console.warn('Error al acceder al contexto de tema, usando tema predeterminado', error);
    themeContext = {
      theme: lightTheme,
      isDark: false,
      toggleTheme: () => {},
      changeTheme: () => {}
    };
  }

  /**
   * Obtiene el valor de color desde la ruta especificada
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
    ...themeContext,
    getColorValue,
  };
}; 