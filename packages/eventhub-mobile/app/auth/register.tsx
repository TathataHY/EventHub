import React from 'react';
import { Stack } from 'expo-router';
import { RegisterScreen } from '@modules/auth/screens';

/**
 * Pantalla de registro utilizando la estructura modular
 */
export default function RegisterPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Crear Cuenta',
        headerShown: false,
      }} />
      <RegisterScreen />
    </>
  );
} 