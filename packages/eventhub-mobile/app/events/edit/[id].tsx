import React from 'react';
import { Stack } from 'expo-router';
import { EventFormScreen } from '@modules/events/screens';

/**
 * Pantalla de edición de evento utilizando la estructura modular
 */
export default function EditEventPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Editar evento',
      }} />
      <EventFormScreen isEditMode={true} />
    </>
  );
} 