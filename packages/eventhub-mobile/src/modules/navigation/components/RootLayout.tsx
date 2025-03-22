import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../../../app';

/**
 * Componente que define la estructura de navegación principal
 * Versión modular del antiguo _layout.tsx
 */
export const RootLayout = () => {
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
        
        {/* Perfil */}
        <Stack.Screen name="profile/edit" options={{ title: 'Editar perfil' }} />
        <Stack.Screen name="profile/achievements" options={{ title: 'Logros' }} />
        <Stack.Screen name="profile/tickets" options={{ title: 'Mis tickets' }} />
        
        {/* Eventos */}
        <Stack.Screen name="events/[id]" options={{ title: 'Detalles del evento' }} />
        <Stack.Screen name="events/comments/[id]" options={{ title: 'Comentarios' }} />
        <Stack.Screen name="events/location/[id]" options={{ title: 'Ubicación', headerShown: false }} />
        <Stack.Screen name="events/create" options={{ title: 'Crear evento' }} />
        <Stack.Screen name="events/validate" options={{ title: 'Validar tickets' }} />
        
        {/* Configuración */}
        <Stack.Screen name="settings" options={{ title: 'Configuración' }} />
        
        {/* Búsqueda */}
        <Stack.Screen name="search" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}; 