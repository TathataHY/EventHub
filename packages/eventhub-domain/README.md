# EventHub Domain

Este paquete contiene las entidades de dominio, interfaces de repositorio, value objects y excepciones de la aplicación EventHub.

## Nueva Estructura Organizada por Características

La capa de dominio está organizada por características del negocio, siguiendo principios de Domain-Driven Design (DDD) y Clean Architecture:

```
src/
├── core/                 # Componentes base y compartidos
│   ├── exceptions/       # Excepciones base del dominio
│   ├── interfaces/       # Interfaces comunes
│   └── utils/            # Utilidades del dominio
│
├── events/               # Módulo de eventos
│   ├── entities/         # Event y entidades relacionadas
│   ├── repositories/     # Interfaces de repositorios de eventos
│   ├── exceptions/       # Excepciones específicas de eventos
│   └── value-objects/    # Value objects específicos de eventos
│
├── users/                # Módulo de usuarios
│   ├── entities/         # User y entidades relacionadas
│   ├── repositories/     # Interfaces de repositorios de usuarios
│   ├── exceptions/       # Excepciones específicas de usuarios
│   └── value-objects/    # Value objects específicos de usuarios
│
├── payments/             # Módulo de pagos
│   ├── entities/         # Payment, Ticket, etc.
│   ├── repositories/     # Interfaces de repositorios de pagos
│   ├── exceptions/       # Excepciones específicas de pagos
│   └── value-objects/    # Value objects específicos de pagos
│
├── groups/               # Módulo de grupos
│   ├── entities/         # Group, GroupMember
│   ├── repositories/     # Interfaces de repositorios de grupos
│   ├── exceptions/       # Excepciones específicas de grupos
│   └── value-objects/    # Value objects específicos de grupos
│
├── notifications/        # Módulo de notificaciones
│   ├── entities/         # Notification, NotificationPreference
│   ├── repositories/     # Interfaces de repositorios de notificaciones
│   ├── exceptions/       # Excepciones específicas de notificaciones
│   └── value-objects/    # NotificationTemplate, NotificationChannel, etc.
│
├── ratings/              # Módulo de calificaciones
│   ├── entities/         # Rating, Comment
│   ├── repositories/     # Interfaces de repositorios de calificaciones
│   └── exceptions/       # Excepciones específicas de calificaciones
│
└── index.ts              # Archivo de exportación
```

## Principios de Diseño

### 1. Entidades Inmutables

Las entidades son inmutables para evitar efectos secundarios. Cada operación que modifica el estado devuelve una nueva instancia de la entidad.

```typescript
// Ejemplo de operación inmutable
const userActivated = user.activate(); // Devuelve una nueva instancia
```

### 2. Value Objects

Los Value Objects encapsulan conceptos del dominio que se identifican por su valor, no por su identidad.

```typescript
// Ejemplo de Value Object
const email = new Email('user@example.com');
```

### 3. Repositorios como Interfaces

Las interfaces de repositorio definen contratos para acceder a datos sin depender de tecnologías específicas.

```typescript
export interface UserRepository extends Repository<User, string> {
  findByEmail(email: string): Promise<User | null>;
}
```

### 4. Excepciones de Dominio

Cada módulo define sus propias excepciones específicas para encapsular errores del dominio.

```typescript
throw new UserCreateException('El nombre es requerido');
```

## Módulos Principales

### Users (Usuarios)

Gestiona la creación, actualización y validación de usuarios del sistema.

### Events (Eventos)

Controla la lógica de creación y gestión de eventos, incluyendo asistentes e información del evento.

### Notifications (Notificaciones)

Administra el envío y recepción de notificaciones entre usuarios y eventos.

### Payments (Pagos)

Gestiona pagos, transacciones y tickets para los eventos.

### Groups (Grupos)

Controla la lógica de grupos de usuarios para asistir a eventos conjuntamente.

### Ratings (Calificaciones)

Gestiona calificaciones y comentarios de los usuarios sobre eventos.

## Uso

Cada módulo exporta sus componentes a través de un archivo index.ts, lo que facilita su importación:

```typescript
import { User, UserRepository, Email, Role } from '@eventhub/domain/users';
```

El archivo principal index.ts exporta todos los módulos organizados:

```typescript
import { User, Event, Payment } from '@eventhub/domain';
``` 