import React from 'react';
import { Stack } from 'expo-router';
import { NotificationsScreen } from '@modules/notifications/screens';

/**
 * Página de notificaciones que utiliza la estructura modular
 */
export default function NotificationsPage() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Notificaciones',
          headerShadowVisible: false
        }} 
      />
      <NotificationsScreen />
    </>
  );
} 