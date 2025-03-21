import { Stack } from 'expo-router';
import { EventDetailsScreen } from '../../src/modules/events/screens';

/**
 * Pantalla de detalles de evento usando la estructura modular
 */
export default function EventPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Detalles del evento',
        headerTransparent: true,
        headerTintColor: 'white',
      }} />
      <EventDetailsScreen />
    </>
  );
} 