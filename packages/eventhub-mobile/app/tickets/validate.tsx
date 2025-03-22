import React from 'react';
import { Stack } from 'expo-router';
import { TicketValidationScreen } from '../../src/modules/tickets';

/**
 * Página de validación de tickets
 */
export default function ValidateTicketsPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Validar tickets',
          presentation: 'modal',
        }}
      />
      <TicketValidationScreen />
    </>
  );
} 