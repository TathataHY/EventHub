# Módulo de Eventos

Este módulo gestiona toda la funcionalidad relacionada con eventos en la aplicación EventHub Mobile.

## Estructura

```
events/
├── components/       # Componentes específicos de eventos
├── hooks/            # Hooks personalizados para eventos
├── screens/          # Pantallas completas
├── services/         # Servicios relacionados con eventos
├── types/            # Definiciones de tipos e interfaces
└── index.ts          # Exportaciones del módulo
```

## Características principales

- Visualización de eventos (lista y detalles)
- Creación y edición de eventos
- Gestión de ubicación de eventos
- Sistema de comentarios para eventos
- Marcadores y favoritos
- Categorización y filtrado de eventos

## Componentes principales

- `EventList`: Muestra una lista de eventos con varias opciones de visualización
- `EventCard`: Tarjeta para mostrar la información resumida de un evento
- `EventDetails`: Muestra información detallada de un evento
- `EventForm`: Formulario para crear o editar eventos
- `EventMap`: Muestra la ubicación del evento en un mapa
- `EventComments`: Sistema de comentarios para eventos

## Pantallas

- `EventsScreen`: Pantalla principal que muestra la lista de eventos
- `EventDetailsScreen`: Muestra los detalles completos de un evento
- `EventFormScreen`: Pantalla de creación/edición de eventos
- `EventCommentsScreen`: Pantalla para ver y agregar comentarios
- `EventLocationScreen`: Pantalla para ver la ubicación del evento

## Hooks

- `useEventDetails`: Obtiene y gestiona los detalles de un evento
- `useEventList`: Obtiene y filtra listas de eventos
- `useEventCreation`: Gestiona la creación y edición de eventos
- `useEventComments`: Gestiona los comentarios de un evento

## Integración con otros módulos

- `auth`: Permisos para crear y editar eventos
- `users`: Información del organizador y asistentes
- `tickets`: Gestión de boletos para eventos
- `gamification`: Logros relacionados con la creación y asistencia a eventos

## Uso desde rutas

Las pantallas de este módulo se utilizan en las rutas de la aplicación:

```tsx
// app/events/[id].tsx
import { EventDetailsScreen } from '../../src/modules/events';

export default function EventDetailsPage({ route }) {
  return <EventDetailsScreen eventId={route.params.id} />;
}
``` 