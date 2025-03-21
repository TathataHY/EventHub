import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../core/context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './AppProvider';

/**
 * Ejemplo de cómo adaptar el actual _layout.tsx
 * Para usar la nueva estructura modular
 */
export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* Estructura principal de pestañas */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Autenticación */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        
        {/* Resto de pantallas */}
        {/* ... */}
      </Stack>
    </AppProvider>
  );
} 