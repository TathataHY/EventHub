# Capa de Infraestructura (eventhub-infrastructure)

Esta capa contiene las implementaciones concretas de los repositorios, entidades ORM, mappers y servicios externos para la aplicación EventHub.

## Repositorios

Los repositorios implementan las interfaces definidas en la capa de dominio, proporcionando acceso a datos concreto.

### TypeORM Repositories

Implementaciones que utilizan TypeORM para interactuar con la base de datos MySQL.

#### TypeOrmEventRepository
- **Interfaz implementada**: `EventRepository` del dominio
- **Entidad relacionada**: `EventEntity`
- **Funcionalidades**:
  - CRUD básico de eventos
  - Búsqueda con filtros avanzados (organizador, fechas, etc.)
  - Paginación de resultados
  - Gestión de relaciones (asistentes)

#### TypeOrmUserRepository
- **Interfaz implementada**: `UserRepository` del dominio
- **Entidad relacionada**: `UserEntity`
- **Funcionalidades**:
  - CRUD básico de usuarios
  - Búsqueda por email (único)
  - Gestión de roles y estado

#### TypeOrmNotificationRepository
- **Interfaz implementada**: `NotificationRepository` del dominio
- **Entidad relacionada**: `NotificationEntity`
- **Funcionalidades**:
  - CRUD básico de notificaciones
  - Búsqueda por usuario
  - Filtrado por estado de lectura
  - Marcado masivo como leídas

### InMemory Repositories

Implementaciones en memoria para pruebas unitarias y desarrollo.

#### InMemoryEventRepository
- **Propósito**: Testing y desarrollo sin base de datos
- **Almacenamiento**: Map en memoria
- **Comportamiento**: Simula todas las operaciones de `EventRepository`

#### InMemoryUserRepository
- **Propósito**: Testing y desarrollo sin base de datos
- **Almacenamiento**: Map en memoria
- **Comportamiento**: Simula todas las operaciones de `UserRepository`

#### InMemoryNotificationRepository
- **Propósito**: Testing y desarrollo sin base de datos
- **Almacenamiento**: Map en memoria
- **Comportamiento**: Simula todas las operaciones de `NotificationRepository`

## Entidades ORM

Definen el esquema de base de datos y son usadas por TypeORM.

### EventEntity
- **Tabla**: `events`
- **Relaciones**:
  - ManyToOne con `UserEntity` (organizador)
  - ManyToMany con `UserEntity` (asistentes)

### UserEntity
- **Tabla**: `users`
- **Relaciones**:
  - OneToMany con `EventEntity` (eventos organizados)
  - ManyToMany con `EventEntity` (eventos a los que asiste)
  - OneToMany con `NotificationEntity` (notificaciones)

### NotificationEntity
- **Tabla**: `notifications`
- **Relaciones**:
  - ManyToOne con `UserEntity` (usuario destinatario)

### NotificationPreferenceEntity
- **Tabla**: `notification_preferences`
- **Relaciones**:
  - OneToOne con `UserEntity`

## Mappers

Convierten entre entidades de dominio y entidades ORM.

### EventMapper
- **Conversiones**:
  - `toDomain(eventEntity)`: EventEntity → Event
  - `toPersistence(event)`: Event → EventEntity

### UserMapper
- **Conversiones**:
  - `toDomain(userEntity)`: UserEntity → User
  - `toPersistence(user)`: User → UserEntity

### NotificationMapper
- **Conversiones**:
  - `toDomain(notificationEntity)`: NotificationEntity → Notification
  - `toPersistence(notification)`: Notification → NotificationEntity

## Servicios Externos

Implementaciones de servicios externos utilizados por la aplicación.

### EmailService
- **Propósito**: Envío de emails a usuarios
- **Funcionalidades**:
  - Envío de confirmación de registro
  - Recuperación de contraseña
  - Notificaciones de eventos

### PushNotificationService
- **Propósito**: Envío de notificaciones push
- **Funcionalidades**:
  - Notificaciones de eventos
  - Alertas de sistema

## Configuración

### Módulos de TypeORM
- Configuración de conexión a base de datos
- Registro de entidades
- Opciones de sincronización de esquema

### Módulos de Inyección de Dependencias
- Registro de repositorios para inyección en los casos de uso
- Configuración de servicios externos 