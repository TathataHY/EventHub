import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';

/**
 * Layout para las rutas de perfil
 * Configura el estilo común para todas las pantallas del perfil
 */
export const ProfileLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme, isDark } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.background.default} 
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.paper,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background.default,
          },
        }}
      >
        {children}
      </Stack>
    </>
  );
}; 