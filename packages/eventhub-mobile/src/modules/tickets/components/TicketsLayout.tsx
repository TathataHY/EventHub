import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

/**
 * Layout para las rutas de tickets
 * Encapsula todas las pantallas de tickets y su configuración
 */
export const TicketsLayout: React.FC = () => {
  const { theme } = useTheme();
  // Simular el modo oscuro (en una implementación real esto sería determinado por el tema)
  const isDark = false;

  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.background.default} 
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.default,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background.default,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Mis Tickets',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="[id]" 
          options={{ 
            title: 'Detalle de Ticket',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="validate" 
          options={{ 
            title: 'Validar Ticket',
            headerShown: true,
          }} 
        />
      </Stack>
    </>
  );
}; 