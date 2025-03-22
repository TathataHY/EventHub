import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import theme from '../../src/theme';

export default function EventsLayout() {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
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
            fontWeight: theme.typography.fontWeight.bold,
          },
          contentStyle: {
            backgroundColor: theme.colors.background.default,
          },
        }}
      >
        <Stack.Screen 
          name="crear-evento" 
          options={{ 
            title: 'Crear Evento',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="evento/[id]" 
          options={{ 
            title: 'Detalles del Evento',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="editar-evento/[id]" 
          options={{ 
            title: 'Editar Evento',
            headerShown: true,
          }} 
        />
        {/* Aquí se pueden agregar más pantallas relacionadas con eventos */}
      </Stack>
    </>
  );
} 