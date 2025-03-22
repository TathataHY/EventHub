import React from 'react';
import { Stack } from 'expo-router';
import { ChangePasswordScreen } from '../../src/modules/auth/screens';

/**
 * Ruta para cambiar la contraseña utilizando el enfoque modular
 */
export default function ChangePasswordRoute() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Cambiar Contraseña',
        headerShown: true,
      }} />
      <ChangePasswordScreen />
    </>
  );
} 