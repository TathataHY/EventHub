import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

/**
 * Layout para las rutas de perfil
 * Configura el estilo común para todas las pantallas del perfil
 */
export const ProfileLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={theme.colors.background.default} 
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.default,
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