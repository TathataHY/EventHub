import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { EventsByCategory } from '../../../src/modules/events/screens/EventsByCategory';

/**
 * Página para mostrar eventos por categoría
 */
export default function EventCategoryPage() {
  // Obtener parámetros de la URL
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const categoryName = name ? decodeURIComponent(name) : '';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen 
        options={{ 
          title: categoryName || 'Categoría de Eventos',
          headerBackTitle: 'Atrás',
        }} 
      />
      <StatusBar barStyle="dark-content" />
      <EventsByCategory 
        categoryId={id} 
        categoryName={categoryName}
      />
    </SafeAreaView>
  );
} 