import React from 'react';
import { Stack } from 'expo-router';
import { EventsScreen } from '@modules/events/screens';

/**
 * Pantalla principal de eventos utilizando la estructura modular
 */
export default function EventsPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Eventos',
      }} />
      <EventsScreen />
    </>
  );
} 