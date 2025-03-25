import React from 'react';
import { Stack } from 'expo-router';
import { ProfileEditScreen } from '@modules/users/screens';

/**
 * Ruta para la edición del perfil de usuario
 */
export default function EditProfileRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Editar Perfil',
          headerShown: true
        }}
      />
      <ProfileEditScreen />
    </>
  );
} 