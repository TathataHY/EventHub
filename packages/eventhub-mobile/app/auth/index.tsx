import React from 'react';
import { Stack } from 'expo-router';
import { WelcomeScreen } from '@modules/auth/screens';

/**
 * Ruta principal de autenticación que muestra la pantalla de bienvenida
 */
export default function AuthIndexRoute() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Bienvenido',
        headerShown: false,
      }} />
      <WelcomeScreen />
    </>
  );
} 