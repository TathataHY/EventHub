import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import theme from '../../src/theme';

export default function AuthLayout() {
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
            fontWeight: theme.typography.fontWeight.bold,
          },
          contentStyle: {
            backgroundColor: theme.colors.background.default,
          },
        }}
      >
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
          name="cambiar-contrasena" 
          options={{ 
            title: 'Cambiar Contraseña',
            headerShown: true,
          }} 
        />
      </Stack>
    </>
  );
} 