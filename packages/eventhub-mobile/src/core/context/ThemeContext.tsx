import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme, ColorValue } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme } from '../../theme/variants/light';
import { darkTheme } from '../../theme/variants/dark';

// Definir tipo de modo de tema
export type ThemeMode = 'light' | 'dark' | 'system';

// Definir tipo de contexto de tema
export interface ThemeContextType {
  theme: typeof lightTheme | typeof darkTheme;
  isDark: boolean;
  toggleTheme: () => void;
  changeTheme: (mode: ThemeMode) => void;
  getColorValue: (colorOrPath: string | ColorValue) => string;
}

// Crear contexto
export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  changeTheme: () => {},
  getColorValue: () => '#000000'
});

// Clave para almacenamiento de preferencia de tema
const THEME_PREFERENCE_KEY = 'theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

// Utilidad para obtener valores de color
const getColorValue = (colorOrPath: string | ColorValue): string => {
  if (!colorOrPath) return '#000000';
  
  if (typeof colorOrPath === 'string') {
    return colorOrPath;
  }
  
  // Si es un objeto ColorValue, convertirlo a string
  return String(colorOrPath);
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? darkTheme : lightTheme);
  const isDark = theme.name === 'dark';

  // Cargar preferencia de tema
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Escuchar cambios en el esquema de colores del sistema
  useEffect(() => {
    if (themeMode === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (savedTheme) {
        const mode = savedTheme as ThemeMode;
        setThemeMode(mode);
        if (mode === 'system') {
          setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
        } else {
          setTheme(mode === 'dark' ? darkTheme : lightTheme);
        }
      }
    } catch (error) {
      console.error('Error al cargar preferencia de tema:', error);
    }
  };

  const saveThemePreference = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      console.error('Error al guardar preferencia de tema:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    setTheme(newMode === 'dark' ? darkTheme : lightTheme);
    saveThemePreference(newMode);
  };

  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    
    if (mode === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    } else {
      setTheme(mode === 'dark' ? darkTheme : lightTheme);
    }
    
    saveThemePreference(mode);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      toggleTheme, 
      changeTheme,
      getColorValue
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el tema
export const useTheme = () => useContext(ThemeContext); 