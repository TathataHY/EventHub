import { Stack } from 'expo-router'; 
import { SettingsScreen } from '../src/modules/settings/screens';

/**
 * Pantalla de configuración utilizando la estructura modular
 */
export default function SettingsPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Configuración',
      }} />
      <SettingsScreen />
    </>
  );
} 