import React from 'react';
import { Stack } from 'expo-router';
import { TicketDetailScreen } from '@modules/tickets/screens/TicketDetailScreen';

export default function TicketDetailRoute() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Detalles de la Entrada',
          headerBackTitle: "Tickets",
        }}
      />
      <TicketDetailScreen />
    </>
  );
} 