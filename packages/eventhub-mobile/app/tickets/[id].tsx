import React from 'react';
import { Stack } from 'expo-router';
import { TicketDetailsScreen } from '@modules/tickets';

/**
 * Página de detalles de ticket
 */
export default function TicketDetailsPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Detalles del ticket',
          presentation: 'card',
        }}
      />
      <TicketDetailsScreen />
    </>
  );
} 