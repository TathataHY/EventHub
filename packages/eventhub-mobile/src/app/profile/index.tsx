import React from 'react';
import { Stack } from 'expo-router';
import { ProfileScreen } from '@modules/users/screens';

export default function ProfileRoute() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Mi Perfil',
          headerShown: true
        }}
      />
      <ProfileScreen />
    </>
  );
} 