# Patrones de Inyección de Dependencias para la Capa Móvil

La inyección de dependencias (DI) es un patrón de diseño que permite separar la creación e inicialización de dependencias de su uso. En el contexto de la capa móvil de EventHub, implementar DI mejora significativamente la testabilidad, mantenibilidad y flexibilidad del código.

## Beneficios de la Inyección de Dependencias

1. **Mejora la Testabilidad**: Facilita la creación de mocks para pruebas unitarias
2. **Reduce el Acoplamiento**: Disminuye las dependencias directas entre componentes
3. **Facilita la Sustitución**: Permite cambiar implementaciones sin modificar el código cliente
4. **Promueve SOLID**: Específicamente los principios de Inversión de Dependencias y Responsabilidad Única

## Enfoques de Inyección de Dependencias en React Native

### 1. React Context API

El uso de React Context es el método más común y natural en aplicaciones React/React Native:

```typescript
// src/core/services/api.service.ts
export interface ApiService {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
  // ...
}

export class HttpApiService implements ApiService {
  // Implementación real que usa Axios/Fetch
}

export class MockApiService implements ApiService {
  // Implementación para pruebas
}

// src/core/context/ApiContext.tsx
import { createContext, useContext } from 'react';

const ApiContext = createContext<ApiService | null>(null);

export const ApiProvider: React.FC = ({ 
  children, 
  service = new HttpApiService() 
}) => {
  return (
    <ApiContext.Provider value={service}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi debe usarse dentro de un ApiProvider');
  }
  return context;
};
```

Uso en un componente:

```typescript
// src/modules/events/hooks/useEvents.ts
import { useApi } from '../../../core/context/ApiContext';

export const useEvents = () => {
  const api = useApi();
  
  const fetchEvents = async () => {
    return api.get('/events');
  };
  
  // ...
  
  return { fetchEvents };
};
```

### 2. Inyección por Props

Para componentes específicos, la inyección directa por props puede ser más explícita:

```typescript
// src/modules/events/components/EventList.tsx
interface EventListProps {
  eventService?: EventService; // Opcional con valor por defecto
}

export const EventList: React.FC<EventListProps> = ({ 
  eventService = defaultEventService 
}) => {
  // Usar eventService para obtener eventos
};
```

### 3. Custom Hooks Factory

Crear hooks que acepten dependencias:

```typescript
// src/modules/auth/hooks/useAuthFactory.ts
export const createUseAuth = (authService: AuthService) => {
  return () => {
    // Implementación usando authService
    return {
      login: (credentials) => authService.login(credentials),
      // ...
    };
  };
};

// Uso predefinido con la implementación por defecto
export const useAuth = createUseAuth(defaultAuthService);

// Para pruebas
const mockAuthService = new MockAuthService();
const useAuthWithMock = createUseAuth(mockAuthService);
```

### 4. Higher Order Components (HOC)

Útil para inyectar múltiples dependencias en componentes:

```typescript
// src/modules/events/hocs/withServices.tsx
export const withServices = (
  Component: React.ComponentType<any>
) => {
  return (props: any) => {
    const eventService = useEventService();
    const authService = useAuthService();
    const notificationService = useNotificationService();
    
    return (
      <Component
        {...props}
        eventService={eventService}
        authService={authService}
        notificationService={notificationService}
      />
    );
  };
};

// Uso
const EnhancedEventList = withServices(EventList);
```

## Implementando la Inyección de Dependencias en Módulos

### Estructura Recomendada

Cada módulo que quiera exponer servicios inyectables debería seguir esta estructura:

```
module/
├── services/
│   ├── service.interface.ts      # Interfaz del servicio
│   ├── service.implementation.ts # Implementación por defecto
│   └── service.mock.ts           # Implementación para pruebas
├── providers/
│   └── ServiceProvider.tsx       # Proveedor de React Context
└── hooks/
    └── useService.ts             # Hook para consumir el servicio
```

### Ejemplo Completo: Módulo de Eventos

```typescript
// src/modules/events/services/event.interface.ts
export interface EventService {
  getEvents: () => Promise<Event[]>;
  getEventById: (id: string) => Promise<Event | null>;
  createEvent: (data: EventCreateDto) => Promise<Event>;
  // ...
}

// src/modules/events/services/event.implementation.ts
import { api } from '../../../core/api';

export class ApiEventService implements EventService {
  async getEvents() {
    const response = await api.get('/events');
    return response.data;
  }
  
  async getEventById(id: string) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  }
  
  // ...
}

// src/modules/events/providers/EventServiceProvider.tsx
import { createContext, useContext } from 'react';
import { EventService } from '../services/event.interface';
import { ApiEventService } from '../services/event.implementation';

const EventServiceContext = createContext<EventService | null>(null);

export const EventServiceProvider: React.FC = ({ 
  children,
  service = new ApiEventService()
}) => {
  return (
    <EventServiceContext.Provider value={service}>
      {children}
    </EventServiceContext.Provider>
  );
};

export const useEventService = () => {
  const context = useContext(EventServiceContext);
  if (!context) {
    throw new Error('useEventService debe usarse dentro de un EventServiceProvider');
  }
  return context;
};
```

## Configuración para Pruebas

La inyección de dependencias facilita enormemente las pruebas unitarias:

```typescript
// src/modules/events/components/__tests__/EventList.test.tsx
import { render, screen } from '@testing-library/react-native';
import { EventList } from '../EventList';
import { MockEventService } from '../../services/event.mock';

describe('EventList', () => {
  it('muestra la lista de eventos correctamente', async () => {
    const mockService = new MockEventService();
    mockService.getEvents = jest.fn().mockResolvedValue([
      { id: '1', title: 'Evento 1' },
      { id: '2', title: 'Evento 2' }
    ]);
    
    render(<EventList eventService={mockService} />);
    
    // Assertions...
  });
});
```

## Uso de Inyección de Dependencias en la Aplicación

Para configurar la aplicación con todos los proveedores:

```typescript
// src/app/AppProvider.tsx
import { ApiProvider } from '../core/context/ApiContext';
import { AuthServiceProvider } from '../modules/auth/providers';
import { EventServiceProvider } from '../modules/events/providers';
// Más proveedores...

export const AppProvider: React.FC = ({ children }) => {
  return (
    <ApiProvider>
      <AuthServiceProvider>
        <EventServiceProvider>
          {/* Más proveedores anidados */}
          {children}
        </EventServiceProvider>
      </AuthServiceProvider>
    </ApiProvider>
  );
};
```

## Sustitución de Servicios para Entornos Específicos

Podemos cambiar implementaciones según el entorno (desarrollo, pruebas, producción):

```typescript
// src/app/AppProvider.tsx
import { ApiProvider } from '../core/context/ApiContext';
import { HttpApiService, MockApiService } from '../core/services/api.service';

export const AppProvider: React.FC = ({ children }) => {
  // Elegir implementación según entorno
  const apiService = __DEV__ ? new MockApiService() : new HttpApiService();
  
  return (
    <ApiProvider service={apiService}>
      {/* Resto de proveedores */}
      {children}
    </ApiProvider>
  );
};
```

## Conclusión

Implementar patrones de inyección de dependencias en la arquitectura modular de la aplicación móvil ofrece un equilibrio perfecto entre flexibilidad y mantenibilidad. La combinación de React Context para la gestión global, hooks personalizados para la lógica de negocios y la inyección por props para componentes específicos proporciona una solución completa que mejora significativamente la testabilidad del código. 