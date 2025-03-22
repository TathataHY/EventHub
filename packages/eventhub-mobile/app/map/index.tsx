import { Stack } from 'expo-router';
import { MapScreen } from '../../src/modules/map/screens';

export default function MapPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Mapa de Eventos',
        headerShown: true 
      }} />
      <MapScreen />
    </>
  );
} 