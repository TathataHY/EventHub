import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';

/**
 * Layout para las rutas de eventos
 * Encapsula todas las pantallas de eventos y su configuración
 */
interface EventsLayoutProps {
  children: React.ReactNode;
}

export const EventsLayout: React.FC<EventsLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background.default}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
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
          name="crear" 
          options={{ 
            title: 'Crear Evento',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="[id]" 
          options={{ 
            title: 'Detalles del Evento',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="validate-tickets" 
          options={{ 
            title: 'Validar Tickets',
            headerShown: true,
          }} 
        />
        {/* Aquí se pueden agregar más pantallas relacionadas con eventos */}
        {children}
      </Stack>
    </>
  );
}; 