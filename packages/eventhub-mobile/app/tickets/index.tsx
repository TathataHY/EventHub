import React from 'react';
import { Stack } from 'expo-router';
import { UserTicketsScreen } from '../../src/modules/tickets';

/**
 * Página de tickets del usuario
 */
export default function TicketsPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mis tickets',
        }}
      />
      <UserTicketsScreen />
    </>
  );
} 