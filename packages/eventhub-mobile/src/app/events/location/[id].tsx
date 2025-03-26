import React from 'react';
import { Stack } from 'expo-router';
import { EventLocationScreen } from '@modules/events/screens';

/**
 * Pantalla de ubicación del evento utilizando la estructura modular
 */
export default function EventLocationPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Ubicación',
      }} />
      <EventLocationScreen />
    </>
  );
} 