# EventHub Mobile

Aplicación móvil para la plataforma EventHub, que permite a los usuarios descubrir, crear y gestionar eventos.

## Características

- **Autenticación de usuarios**: Registro, inicio de sesión y recuperación de contraseña.
- **Exploración de eventos**: Buscar y filtrar eventos por categoría o texto.
- **Gestión de eventos**: Crear, editar y eliminar eventos propios.
- **Asistencia a eventos**: Registrarse para asistir a eventos y cancelar asistencia.
- **Perfil de usuario**: Ver y editar información del perfil, así como gestionar eventos propios y asistencias.

## Tecnologías utilizadas

- React Native / Expo
- TypeScript
- Expo Router para la navegación
- Formik y Yup para la validación de formularios
- Axios para las peticiones HTTP
- AsyncStorage para el almacenamiento local
- date-fns para el manejo de fechas

## Documentación de Arquitectura

La aplicación móvil sigue una **Arquitectura Modular** (Feature-First) que organiza el código por características o módulos funcionales.

### Documentación Detallada

- [Arquitectura Modular de la Capa Móvil](../../docs/architecture/mobile_modular_architecture.md): Descripción general de la arquitectura, sus principios y estructura.
- [Guía de Comunicación entre Módulos](../../docs/architecture/mobile_modules_communication.md): Patrones y directrices para la comunicación entre los diferentes módulos.
- [Patrones de Inyección de Dependencias](../../docs/architecture/mobile_dependency_injection.md): Implementación de inyección de dependencias para mejorar la testabilidad.

## Estructura Actual del Proyecto

```
eventhub-mobile/
├── app/                         # Rutas de la aplicación (Expo Router)
│   ├── _layout.tsx              # Layout principal (configuración de Stack)
│   ├── index.tsx                # Redirección a tabs
│   ├── search.tsx               # Página de búsqueda
│   ├── settings.tsx             # Página de configuración
│   ├── (tabs)/                  # Navegación por pestañas
│   │   ├── _layout.tsx          # Configuración de pestañas
│   │   ├── index.tsx            # Pestaña de inicio
│   │   ├── events.tsx           # Pestaña de eventos
│   │   ├── notifications.tsx    # Pestaña de notificaciones
│   │   ├── profile.tsx          # Pestaña de perfil
│   │   ├── scan.tsx             # Funcionalidad de escaneo
│   │   └── notificaciones.tsx   # (Duplicado para migrar)
│   ├── events/                  # Rutas relacionadas con eventos
│   │   ├── _layout.tsx          # Layout específico de eventos
│   │   ├── [id].tsx             # Página de detalles de evento
│   │   ├── crear.tsx            # Creación de evento (por migrar)
│   │   ├── crear-evento.tsx     # Creación de evento (por migrar)
│   │   ├── validate-tickets.tsx # Validación de tickets (por migrar)
│   │   ├── comments/
│   │   │   └── [id].tsx         # Comentarios de evento
│   │   └── location/
│   │       └── [id].tsx         # Ubicación de evento
│   ├── auth/                    # Rutas de autenticación
│   ├── profile/                 # Rutas de perfil de usuario
│   └── map/                     # Rutas de mapas
│
├── src/                        # Código fuente principal
│   ├── app/                    # Configuración global 
│   │   ├── index.ts            # Exportaciones centrales
│   │   ├── AppProvider.tsx     # Proveedores globales
│   │   ├── AppLayout.tsx       # Layout de aplicación
│   │   ├── ExampleLayout.tsx   # Ejemplo de layout
│   │   └── README.md           # Documentación
│   │
│   ├── core/                   # Funcionalidad central
│   │   ├── api/                # Configuración de API
│   │   ├── context/            # Contextos globales (ThemeContext, etc.)
│   │   ├── mocks/              # Datos de prueba (data.ts)
│   │   │   └── data.ts         # Datos mock para desarrollo
│   │   ├── navigation/         # Configuración de navegación
│   │   │   └── index.ts        # Exportaciones de navegación
│   │   ├── services/           # Servicios compartidos
│   │   │   ├── auth.service.ts # Autenticación
│   │   │   ├── event.service.ts # Eventos
│   │   │   ├── mock.service.ts # Servicios con datos mock
│   │   │   └── ...
│   │   ├── storage/            # Almacenamiento local
│   │   └── index.ts            # Exportaciones del core
│   │
│   ├── modules/                # Módulos funcionales
│   │   ├── auth/               # Autenticación
│   │   │   ├── components/     # Componentes específicos
│   │   │   ├── screens/        # Pantallas de autenticación
│   │   │   ├── services/       # Servicios de autenticación
│   │   │   └── index.ts        # Exportaciones del módulo
│   │   │
│   │   ├── events/             # Gestión de eventos
│   │   │   ├── components/     # Componentes de eventos
│   │   │   ├── screens/        # Pantallas de eventos
│   │   │   │   ├── EventDetailsScreen.tsx   # Detalles de evento
│   │   │   │   ├── EventCommentsScreen.tsx  # Comentarios
│   │   │   │   ├── EventLocationScreen.tsx  # Ubicación
│   │   │   │   └── ...
│   │   │   ├── services/       # Servicios de eventos
│   │   │   ├── hooks/          # Hooks específicos
│   │   │   └── index.ts        # Exportaciones del módulo
│   │   │
│   │   ├── users/              # Gestión de usuarios y perfiles
│   │   ├── notifications/      # Sistema de notificaciones
│   │   ├── search/             # Funcionalidad de búsqueda
│   │   ├── settings/           # Configuración de la aplicación
│   │   ├── navigation/         # Componentes de navegación modularizados
│   │   │   ├── components/
│   │   │   │   ├── RootLayout.tsx  # Layout principal
│   │   │   │   └── TabsLayout.tsx  # Layout de pestañas
│   │   │   └── index.ts
│   │   ├── home/               # Módulo de pantalla de inicio
│   │   ├── map/                # Funcionalidad de mapas
│   │   ├── payments/           # Procesamiento de pagos
│   │   └── index.ts            # Exportaciones de todos los módulos
│   │
│   ├── shared/                 # Componentes y utilidades compartidas
│   │   ├── components/         # Componentes UI reutilizables
│   │   │   ├── common/         # Componentes básicos (Button, Card, etc.)
│   │   │   └── ...
│   │   ├── hooks/              # Hooks personalizados
│   │   ├── layouts/            # Layouts reutilizables
│   │   ├── forms/              # Componentes de formulario
│   │   ├── types/              # Interfaces y tipos
│   │   │   └── index.ts        # Definiciones de tipos compartidos
│   │   ├── utils/              # Utilidades generales
│   │   └── index.ts            # Exportaciones de shared
│   │
│   └── theme/                  # Configuración de estilos y tema
│       ├── colors.ts           # Paleta de colores
│       ├── spacing.ts          # Espaciado
│       ├── typography.ts       # Tipografía
│       └── index.ts            # Exportaciones de tema
│
├── assets/                     # Recursos estáticos
│   ├── images/                 # Imágenes
│   └── fonts/                  # Fuentes
│
├── babel.config.js             # Configuración de Babel
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración de TypeScript
├── app.json                    # Configuración de Expo
└── README.md                   # Este archivo
```

## Estado Actual de Desarrollo

### Componentes ya modularizados:
- ✅ Layouts principales en `modules/navigation`
- ✅ Pantallas de eventos en `modules/events/screens`
- ✅ Pantalla de perfil en `modules/users/screens`
- ✅ Pantalla de inicio en `modules/home/screens`
- ✅ Pantalla de notificaciones en `modules/notifications/screens`
- ✅ Pantalla de configuración en `modules/settings/screens`

### Pendientes de modularizar:
- ⏳ Algunas pantallas en `app/events` (crear.tsx, validate-tickets.tsx)
- ⏳ Componentes específicos de cada módulo
- ⏳ Servicios específicos por módulo

## Principios de Organización

1. **Separación de Responsabilidades**:
   - `app/`: Define DÓNDE se muestran las cosas (rutas)
   - `src/modules/`: Define QUÉ se muestra (componentes y lógica)
   - `src/shared/`: Define elementos reutilizables
   - `src/core/`: Define servicios y configuraciones centrales

2. **Modularidad**:
   - Cada módulo funcional está autocontenido
   - Cada módulo tiene sus propios componentes, pantallas y servicios
   - Los módulos pueden importar desde `shared/` y `core/`

3. **Escalabilidad**:
   - Fácil de extender con nuevos módulos
   - Organización por dominios funcionales
   - Baja cohesión entre módulos

## Flujo de Desarrollo

### 1. Crear o modificar un componente o pantalla:

```typescript
// src/modules/events/components/EventCard.tsx
import React from 'react';
import { View, Text } from 'react-native';

export const EventCard = ({ event }) => {
  return (
    <View>
      <Text>{event.title}</Text>
      {/* más elementos */}
    </View>
  );
};
```

### 2. Crear o modificar una pantalla:

```typescript
// src/modules/events/screens/EventListScreen.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { EventCard } from '../components';
import { useEvents } from '../hooks';

export const EventListScreen = () => {
  const { events, loading } = useEvents();
  
  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
```

### 3. Conectar con la ruta en `app/`:

```typescript
// app/events/index.tsx
import { EventListScreen } from '../../src/modules/events/screens';

export default function EventsPage() {
  return <EventListScreen />;
}
```

## Datos Mock

Durante el desarrollo, usamos datos mock para simular la API:

```typescript
// Uso de datos mock
import { mockService } from '../../src/core/services';

// En cualquier componente o servicio:
const events = mockService.getEvents();
const users = mockService.getUsers();
```

## Buenas Prácticas

1. **Estructura de Archivos**:
   - Nombres en camelCase para archivos
   - Un componente por archivo
   - Exportar desde index.ts
   - Organizar por funcionalidad

2. **Componentes**:
   - Preferir componentes funcionales con hooks
   - Usar TypeScript para tipos
   - Extraer lógica compleja a hooks personalizados

3. **Rutas**:
   - La carpeta `app/` debe tener mínima lógica
   - Simplemente importar y usar componentes de módulos
   - Configurar opciones de navegación según necesidad

4. **Desarrollo con IA**:
   - Usar IA para acelerar desarrollo
   - Especificar claramente la ubicación y propósito de los componentes
   - Revisar y entender el código generado

## Instalación

1. Asegúrate de tener Node.js y npm instalados
2. Instala Expo CLI: `npm install -g expo-cli`
3. Clona el repositorio
4. Navega al directorio del proyecto: `cd eventhub/packages/eventhub-mobile`
5. Instala las dependencias: `npm install`
6. Inicia la aplicación: `npm start`

## Uso

- Usa Expo Go en tu dispositivo móvil para escanear el código QR
- O ejecuta en un emulador con: `npm run android` o `npm run ios`

## Pantallas principales

### Autenticación
- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nueva cuenta
- **Recuperación de contraseña**: Solicitud de restablecimiento por email

### Eventos
- **Lista de eventos**: Exploración de todos los eventos disponibles
- **Detalle de evento**: Información completa y opciones de asistencia
- **Crear/Editar evento**: Formulario para gestionar eventos propios

### Perfil
- **Perfil de usuario**: Información personal y estadísticas
- **Mis eventos**: Eventos creados por el usuario
- **Eventos asistiendo**: Eventos a los que el usuario asistirá

## API

La aplicación se comunica con el backend de EventHub a través de una API RESTful. Los principales endpoints utilizados son:

- `/auth`: Autenticación y gestión de usuarios
- `/events`: CRUD de eventos y gestión de asistencias
- `/notifications`: Gestión de notificaciones

## Estado del proyecto

Esta aplicación está en desarrollo activo. Las próximas características incluirán:
- Notificaciones push
- Compartir eventos en redes sociales
- Mapas y ubicaciones de eventos
- Galería de fotos para eventos 