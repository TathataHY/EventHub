import React from 'react';
import { Stack } from 'expo-router';
import { LoginScreen } from '@modules/auth/screens';

/**
 * Pantalla de inicio de sesión utilizando la estructura modular
 */
export default function LoginPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Iniciar Sesión',
        headerShown: false,
      }} />
      <LoginScreen />
    </>
  );
} 