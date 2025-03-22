import React from 'react';
import { Stack } from 'expo-router';
import { ForgotPasswordScreen } from '../../src/modules/auth/screens';

/**
 * Pantalla de recuperación de contraseña utilizando la estructura modular
 */
export default function ForgotPasswordPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Recuperar Contraseña',
        headerShown: false,
      }} />
      <ForgotPasswordScreen />
    </>
  );
} 