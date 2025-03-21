import { Stack } from 'expo-router';
import { EventCommentsScreen } from '../../../src/modules/events/screens';

/**
 * Pantalla de comentarios de evento utilizando la estructura modular
 */
export default function EventCommentsPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Comentarios',
      }} />
      <EventCommentsScreen />
    </>
  );
} 