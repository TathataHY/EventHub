# EventHub Domain

## Descripción

La capa de dominio de EventHub implementa las reglas de negocio y la lógica central de la aplicación siguiendo los principios de Domain-Driven Design (DDD). Esta capa es independiente de frameworks y tecnologías específicas, lo que permite centrarse en el modelado del problema y facilita su reutilización y testabilidad.

## Arquitectura

La arquitectura de la capa de dominio sigue el siguiente modelo:

```
packages/eventhub-domain/
├── src/
│   ├── core/               # Componentes base y compartidos
│   │   ├── exceptions/     # Excepciones base del dominio
│   │   ├── interfaces/     # Interfaces comunes (Entity, ValueObject, Repository)
│   │   └── utils/          # Utilidades del dominio
│   │
│   ├── users/              # Módulo de usuarios
│   ├── events/             # Módulo de eventos
│   ├── tickets/            # Módulo de tickets
│   ├── payments/           # Módulo de pagos
│   ├── groups/             # Módulo de grupos
│   ├── attendances/        # Módulo de asistencias
│   ├── notifications/      # Módulo de notificaciones
│   ├── reviews/            # Módulo de reseñas
│   ├── media/              # Módulo de archivos multimedia
│   └── ...
│
└── tests/                  # Tests unitarios
```

## Principios y patrones

Esta capa implementa los siguientes patrones y principios:

### 1. Domain-Driven Design (DDD)

- **Entidades**: Objetos con identidad única y ciclo de vida largo (Event, User, etc.).
- **Objetos de Valor**: Objetos inmutables sin identidad (Money, Email, etc.).
- **Agregados**: Agrupaciones de entidades y objetos de valor con una entidad raíz.
- **Repositorios**: Interfaces para la persistencia de agregados.

### 2. Clean Architecture

- **Independencia de frameworks**: La lógica de dominio no depende de frameworks externos.
- **Inversión de dependencias**: El dominio define interfaces que la infraestructura implementa.
- **Testabilidad**: Todas las reglas de negocio pueden probarse de forma aislada.

### 3. Arquitectura Hexagonal

- **Puertos y adaptadores**: El dominio define puertos (interfaces) que son implementados por adaptadores.
- **Separación clara**: División entre la lógica de dominio y la infraestructura.

## Estructura modular

Cada módulo de dominio sigue esta estructura:

```
module/
├── entities/            # Entidades del módulo
├── value-objects/       # Objetos de valor específicos
├── repositories/        # Interfaces de repositorio
├── exceptions/          # Excepciones específicas
└── index.ts             # Exporta todos los componentes del módulo
```

### Estándares de codificación

1. **Inmutabilidad**: Las entidades y objetos de valor son inmutables para prevenir efectos secundarios.
2. **Factory methods**: Se utilizan métodos estáticos para crear instancias validadas.
3. **Validación temprana**: Los datos se validan en el momento de la creación.
4. **Encapsulamiento**: Las propiedades privadas se acceden mediante getters.
5. **Nombres descriptivos**: Uso de nombres que reflejan el lenguaje ubicuo del dominio.

## Componentes principales

### Core

- **Entity**: Interfaz base para todas las entidades con id y métodos comunes.
- **ValueObject**: Interfaz para objetos de valor inmutables.
- **Repository**: Interfaz genérica para operaciones CRUD.
- **DomainException**: Clase base para excepciones específicas del dominio.

### Módulos de dominio

#### Users

Gestiona los usuarios, roles y autenticación.

#### Events

Gestiona la creación, publicación y administración de eventos.

#### Tickets

Gestiona la venta y administración de tickets para eventos.

#### Payments

Gestiona las transacciones y pagos de la plataforma.

#### Groups

Gestiona grupos de usuarios con intereses comunes.

#### Notifications

Gestiona las notificaciones enviadas a los usuarios.

## Reglas de negocio principales

- Los eventos deben tener un título, descripción, fecha y organizador.
- Los tickets están asociados a un evento específico y tienen una cantidad limitada.
- Los usuarios pueden tener diferentes roles con distintos permisos.
- Los pagos deben registrar el método, monto, estado y referencias.
- Las notificaciones tienen un tipo, destinatario y contenido.

## Uso

Para utilizar la capa de dominio en otros componentes:

```typescript
// En una capa de aplicación o infraestructura
import { Event, EventRepository, EventCreateProps, EventFilters } from '@eventhub/domain';

// Creación de una entidad
const eventProps: EventCreateProps = {
  title: 'Conferencia de Tecnología',
  description: 'Evento sobre las últimas tendencias',
  startDate: new Date(),
  endDate: new Date(Date.now() + 86400000),
  location: EventLocation.create({
    name: 'Centro de Convenciones',
    address: 'Calle Principal 123',
    city: 'Madrid',
    country: 'España'
  }),
  organizerId: 'user-123'
};

const event = Event.create(eventProps);

// Uso de un repositorio (implementado en la capa de infraestructura)
const savedEvent = await eventRepository.save(event);
```

## Desarrollo

### Instalación

```bash
cd packages/eventhub-domain
npm install
```

### Compilación

```bash
npm run build
```

### Tests

```bash
npm test
```

## Extensibilidad

Para agregar un nuevo módulo de dominio:

1. Crear carpeta para el nuevo módulo con su estructura estándar.
2. Definir entidades, objetos de valor y excepciones.
3. Definir interfaces de repositorio.
4. Exportar todos los componentes en el index.ts del módulo.
5. Actualizar el index.ts principal para exportar el nuevo módulo.

## Contribución

1. Mantener la independencia de la capa de dominio.
2. Aplicar principios de código limpio y DDD.
3. Escribir tests para todas las reglas de negocio.
4. Documentar con TSDoc todas las clases, métodos e interfaces.
5. Seguir los estándares de codificación del proyecto. 