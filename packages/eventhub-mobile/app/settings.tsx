import { Stack } from 'expo-router'; 
import { SettingsScreen } from '@modules/settings/components/SettingsScreen';

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