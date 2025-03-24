import React from 'react';
import { Stack } from 'expo-router';
import { SavedEventsScreen } from '@modules/events/screens/SavedEventsScreen';

export default function SavedEventsRoute() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Eventos Guardados",
          headerBackTitle: "Perfil",
        }}
      />
      <SavedEventsScreen />
    </>
  );
} 