import { Stack } from 'expo-router';
import { EventFormScreen } from '../../src/modules/events/screens';

/**
 * Pantalla de creación de evento utilizando la estructura modular
 */
export default function CreateEventPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Crear evento',
      }} />
      <EventFormScreen />
    </>
  );
} 