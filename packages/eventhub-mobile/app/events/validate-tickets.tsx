import { Stack } from 'expo-router';
import { TicketValidationScreen } from '@modules/tickets/screens';

/**
 * Pantalla de validación de tickets utilizando la estructura modular
 */
export default function ValidateTicketsPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Validar tickets',
      }} />
      <TicketValidationScreen />
    </>
  );
} 