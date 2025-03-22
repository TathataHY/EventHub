import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';

/**
 * Layout para las rutas de autenticación
 * Encapsula todas las pantallas de autenticación y su configuración
 */
export const AuthLayout: React.FC = () => {
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
        <Stack.Screen 
          name="index"
          options={{ 
            title: 'EventHub',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Iniciar Sesión',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            title: 'Registro',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="forgot-password" 
          options={{ 
            title: 'Recuperar Contraseña',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="reset-password" 
          options={{ 
            title: 'Restablecer Contraseña',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="change-password" 
          options={{ 
            title: 'Cambiar Contraseña',
            headerShown: true,
          }} 
        />
      </Stack>
    </>
  );
}; 