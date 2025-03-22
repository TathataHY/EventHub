import { Stack } from 'expo-router';
import { EventLocationScreen } from '../../../src/modules/events/screens';

/**
 * Pantalla de ubicación de evento utilizando la estructura modular
 */
export default function EventLocationPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Ubicación',
        headerTransparent: true,
        headerTintColor: 'white',
      }} />
      <EventLocationScreen />
    </>
  );
} 