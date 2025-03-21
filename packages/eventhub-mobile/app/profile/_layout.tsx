import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import theme from '../../src/theme';

export default function ProfileLayout() {
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
          name="editar-perfil" 
          options={{ 
            title: 'Editar Perfil',
            headerShown: true,
          }} 
        />
        {/* Aquí se pueden agregar más pantallas relacionadas con el perfil */}
      </Stack>
    </>
  );
} 