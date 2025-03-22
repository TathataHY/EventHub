# Guía de Comunicación entre Módulos en la Capa Móvil

Esta guía establece los principios y patrones para la comunicación entre los diferentes módulos de la capa móvil de EventHub, asegurando un acoplamiento bajo y una alta cohesión.

## Principios Básicos

1. **Independencia**: Los módulos deben ser lo más independientes posible
2. **Interfaces explícitas**: La comunicación debe realizarse a través de interfaces bien definidas
3. **Mínima dependencia**: Un módulo debe depender del mínimo número de otros módulos
4. **Desacoplamiento**: Preferir comunicación indirecta cuando sea posible
5. **Documentación**: Todo punto de comunicación debe estar documentado

## Mecanismos de Comunicación Recomendados

### 1. Exportaciones Públicas (API de Módulo)

Cada módulo debe exponer una API pública clara a través de su archivo `index.ts`:

```typescript
// src/modules/events/index.ts
export { EventList, EventCard } from './components';
export { EventDetailsScreen, EventListScreen } from './screens';
export { useEventDetails, useEventsList } from './hooks';
export type { Event, EventStatus } from './types';

// No exportar componentes internos, servicios privados, etc.
```

**Buena práctica**: En comentarios, documentar el propósito de cada exportación y sus requisitos.

### 2. Servicios Compartidos

Para funcionalidad que debe ser accesible desde múltiples módulos:

```typescript
// src/core/services/auth.service.ts
export const AuthService = {
  getUserPermissions: () => { /* ... */ },
  canUserCreateEvent: (userId: string) => { /* ... */ },
  // ...
};
```

Estos servicios actúan como intermediarios entre módulos, reduciendo dependencias directas.

### 3. Contextos y Providers (Estado Compartido)

Usar contextos de React para compartir estado entre módulos:

```typescript
// src/core/context/UserContext.tsx
export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  // Implementación...
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
```

Luego cualquier módulo puede consumir este contexto:

```typescript
// En cualquier componente
import { useContext } from 'react';
import { UserContext } from '../../core/context/UserContext';

const MyComponent = () => {
  const { user } = useContext(UserContext);
  // ...
};
```

### 4. Sistema de Eventos (Event Bus / PubSub)

Para comunicación completamente desacoplada (especialmente útil para notificaciones):

```typescript
// src/core/events/eventBus.ts
type EventHandler = (data: any) => void;

const eventBus = {
  events: {} as Record<string, EventHandler[]>,
  
  subscribe(event: string, callback: EventHandler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    
    return () => this.unsubscribe(event, callback);
  },
  
  unsubscribe(event: string, callback: EventHandler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  },
  
  publish(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
};

export default eventBus;
```

Uso:
```typescript
// En el módulo de tickets
import eventBus from '../../core/events/eventBus';

function confirmTicketPurchase(ticketId: string) {
  // Procesar compra...
  
  // Notificar a otros módulos
  eventBus.publish('ticketPurchased', { ticketId, timestamp: new Date() });
}

// En el módulo de notificaciones
import eventBus from '../../core/events/eventBus';

useEffect(() => {
  const unsubscribe = eventBus.subscribe('ticketPurchased', (data) => {
    showNotification(`Ticket comprado a las ${data.timestamp}`);
  });
  
  return unsubscribe;
}, []);
```

## Patrones de Inyección de Dependencias

La inyección de dependencias mejora la testabilidad y flexibilidad del código:

### 1. Provider Pattern

```typescript
// src/modules/events/providers/EventsProvider.tsx
export const EventsContext = createContext<EventsContextValue | null>(null);

export const EventsProvider: React.FC = ({ children, eventService = defaultEventService }) => {
  // Implementación usando eventService inyectado
  
  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
```

### 2. HOC (Higher Order Component)

```typescript
// src/modules/events/hocs/withEventService.tsx
export const withEventService = (Component) => {
  return (props) => {
    // Obtener o crear servicio
    const eventService = useEventService();
    
    // Pasar como prop
    return <Component {...props} eventService={eventService} />;
  };
};
```

### 3. Custom Hooks

```typescript
// src/modules/events/hooks/useEventService.ts
export const useEventService = () => {
  // Puede obtener el servicio de un contexto
  // o crearlo según la configuración actual
  return {
    getEvents: () => { /* ... */ },
    createEvent: (data) => { /* ... */ },
    // ...
  };
};
```

## Ejemplos de Comunicación entre Módulos

### Escenario 1: Creación de Evento y Notificación

```
events ──┐
         │
         ▼
     core/services ───┐
         │            │
         │            ▼
         └───► notifications
```

1. El módulo `events` usa `EventService` para crear un evento
2. `EventService` emite un evento a través de `eventBus`
3. El módulo `notifications` escucha ese evento y muestra notificación

### Escenario 2: Compra de Ticket para un Evento

```
tickets ───► events
    │
    └───► payments
```

1. El módulo `tickets` importa interfaces públicas de `events`
2. `tickets` coordina con `payments` para proceso de pago
3. `tickets` actualiza la lista de asistentes en el evento

## Antipatrones a Evitar

1. **Dependencias Circulares**: Módulos que dependen mutuamente entre sí
2. **Importaciones Profundas**: Importar desde archivos internos de otros módulos
3. **Acoplamiento Excesivo**: Un módulo que depende de muchos otros
4. **Servicios Singleton Globales**: Preferir inyección de dependencias

## Documentación y Convenciones

### Archivos index.ts

Cada módulo debe tener un `index.ts` con comentarios claros:

```typescript
// src/modules/events/index.ts

// Componentes públicos para uso en otros módulos
export { EventCard, EventList } from './components';

// Pantallas que pueden ser usadas directamente por rutas
export { EventDetailsScreen, EventListScreen } from './screens';

// Hooks para acceder a la funcionalidad del módulo
export { useEventDetails, useEvents } from './hooks';

// Tipos que otros módulos pueden necesitar
export type { Event, EventCategory } from './types';

// PRIVATE - Estos componentes son solo para uso interno del módulo
// export { EventCardSkeleton } from './components';
``` 