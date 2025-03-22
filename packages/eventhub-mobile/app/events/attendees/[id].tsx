import React from 'react';
import { Stack } from 'expo-router';
import { EventAttendeesScreen } from '../../../src/modules/events/screens';

/**
 * Pantalla de asistentes del evento utilizando la estructura modular
 */
export default function EventAttendeesPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Asistentes',
      }} />
      <EventAttendeesScreen />
    </>
  );
} 