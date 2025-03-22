# Arquitectura Modular de la Capa Móvil

## Introducción

La capa móvil de EventHub implementa una **Arquitectura Modular** (también conocida como Feature-First Architecture), que organiza el código por características o módulos funcionales de la aplicación. Esta arquitectura está especialmente adaptada para aplicaciones React Native/Expo y facilita el desarrollo, mantenimiento y escalabilidad.

## Principios Fundamentales

### 1. Separación de Responsabilidades

La estructura del proyecto separa claramente las diferentes responsabilidades:

- **app/**: Define DÓNDE se muestran las cosas (rutas y navegación)
- **src/modules/**: Define QUÉ se muestra (componentes y lógica de negocio)
- **src/shared/**: Define elementos reutilizables entre módulos
- **src/core/**: Define servicios y configuraciones centrales
- **src/theme/**: Define estilos y temas globales

### 2. Modularidad

Cada módulo es una unidad funcional autocontenida que representa una característica de negocio:

- Encapsula todos los aspectos relacionados con esa característica
- Tiene sus propios componentes, pantallas, servicios, etc.
- Es independiente de otros módulos en la medida de lo posible
- Facilita la paralelización del trabajo en equipos grandes

### 3. Organización por Dominio

La estructura refleja el dominio del negocio (Domain-Driven Design):

- **events/**: Todo lo relacionado con eventos
- **tickets/**: Gestión de tickets
- **users/**: Gestión de usuarios y perfiles
- **notifications/**: Sistema de notificaciones
- etc.

## Estructura Detallada

```
eventhub-mobile/
├── app/                         # Rutas y navegación (Expo Router)
│   ├── (tabs)/                  # Navegación principal por pestañas
│   ├── auth/                    # Rutas de autenticación
│   ├── events/                  # Rutas de eventos
│   ├── profile/                 # Rutas de perfil
│   └── ...                      # Otras rutas
│
├── src/                         # Código fuente principal
│   ├── app/                     # Configuración global
│   │   ├── AppProvider.tsx      # Proveedores globales
│   │   └── ...
│   │
│   ├── modules/                 # Módulos funcionales (por característica)
│   │   ├── auth/                # Módulo de autenticación
│   │   │   ├── components/      # Componentes específicos
│   │   │   ├── screens/         # Pantallas completas
│   │   │   ├── services/        # Servicios específicos
│   │   │   ├── hooks/           # Hooks personalizados
│   │   │   ├── types/           # Tipos e interfaces
│   │   │   └── index.ts         # Exportaciones públicas
│   │   │
│   │   ├── events/              # Módulo de eventos
│   │   ├── tickets/             # Módulo de tickets
│   │   └── ...                  # Otros módulos
│   │
│   ├── shared/                  # Componentes y utilidades compartidas
│   │   ├── components/          # Componentes UI reutilizables
│   │   ├── hooks/               # Hooks genéricos
│   │   └── ...
│   │
│   ├── core/                    # Núcleo de la aplicación
│   │   ├── api/                 # Configuración de API
│   │   ├── services/            # Servicios compartidos
│   │   └── ...
│   │
│   └── theme/                   # Configuración de estilos
│
└── assets/                      # Recursos estáticos
```

## Comunicación entre Módulos

Los módulos pueden comunicarse entre sí, pero deben hacerlo a través de interfaces bien definidas:

1. **Exportaciones Públicas**: Cada módulo expone una API pública en su `index.ts`
2. **Eventos Globales**: Para comunicación desacoplada
3. **Servicios Compartidos**: Ubicados en la carpeta `core/`
4. **Store Global**: Para estado compartido cuando sea necesario

## Comparación con Clean Architecture

A diferencia de la **Clean Architecture** utilizada en la capa domain (que separa por capas técnicas: repositories, use cases, entities), la Arquitectura Modular:

- **Organiza por funcionalidad** en lugar de por capa técnica
- **Optimiza para equipos de desarrollo** que trabajan en paralelo
- **Simplifica el desarrollo de UI** al mantener componentes y lógica juntos
- **Reduce la complejidad de navegación** entre archivos relacionados

## Ventajas de esta Arquitectura

1. **Escalabilidad**: Facilita añadir nuevas características sin impactar las existentes
2. **Mantenibilidad**: Cambios localizados que no afectan a todo el sistema
3. **Paralelización**: Diferentes equipos pueden trabajar en diferentes módulos
4. **Reutilización**: Componentes compartidos bien definidos
5. **Comprensión**: Estructura intuitiva basada en características del negocio

## Patrones Recomendados

1. **Facade Pattern**: Ocultar la complejidad interna de los módulos
2. **Provider Pattern**: Para inyección de dependencias
3. **Adapter Pattern**: Para interactuar con APIs externas
4. **Compound Components**: Para componentes UI complejos 