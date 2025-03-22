# Módulo de Tickets

Este módulo gestiona toda la funcionalidad relacionada con tickets (boletos) en la aplicación EventHub Mobile.

## Estructura

```
tickets/
├── components/       # Componentes específicos de tickets
├── hooks/            # Hooks personalizados para tickets
├── screens/          # Pantallas completas
├── services/         # Servicios relacionados con tickets
├── types/            # Definiciones de tipos e interfaces
└── index.ts          # Exportaciones del módulo
```

## Características principales

- Visualización de tickets adquiridos
- Compra de tickets para eventos
- Validación de tickets en eventos
- Códigos QR/Barcode para tickets
- Historial de tickets
- Transferencia de tickets

## Componentes principales

- `TicketCard`: Muestra información resumida de un ticket
- `TicketDetails`: Muestra información detallada de un ticket
- `TicketScanner`: Componente para escanear y validar tickets
- `TicketPurchaseForm`: Formulario para la compra de tickets
- `TicketQRCode`: Generador de código QR para tickets

## Pantallas

- `UserTicketsScreen`: Muestra los tickets del usuario
- `TicketDetailsScreen`: Muestra los detalles de un ticket
- `TicketValidationScreen`: Pantalla para validar tickets en eventos
- `TicketPurchaseScreen`: Pantalla para comprar tickets

## Hooks

- `useTickets`: Obtiene y gestiona los tickets del usuario
- `useTicketValidation`: Gestiona la validación de tickets
- `useTicketPurchase`: Gestiona la compra de tickets

## Integración con otros módulos

- `auth`: Permisos y autenticación para la compra y validación
- `events`: Información del evento asociado al ticket
- `users`: Información del propietario del ticket
- `payments`: Procesamiento de pagos para compra de tickets

## Uso desde rutas

Las pantallas de este módulo se utilizan en las rutas de la aplicación:

```tsx
// app/events/validate-tickets.tsx
import { TicketValidationScreen } from '../../src/modules/tickets';

export default function ValidateTicketsPage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Validar tickets' }} />
      <TicketValidationScreen />
    </>
  );
}
``` 