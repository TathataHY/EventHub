import React from 'react';
import { Stack } from 'expo-router';
import { ResetPasswordScreen } from '../../src/modules/auth/screens';

/**
 * Pantalla de restablecimiento de contraseña utilizando la estructura modular
 */
export default function ResetPasswordPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Restablecer Contraseña',
        headerShown: false,
      }} />
      <ResetPasswordScreen />
    </>
  );
} 