import { Stack } from 'expo-router';
import { RootLayoutProvider } from '../src/core/providers';

/**
 * Layout principal de la aplicación que utiliza la estructura modular
 */
export default function RootLayout() {
  return (
    <RootLayoutProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="events" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </RootLayoutProvider>
  );
} 