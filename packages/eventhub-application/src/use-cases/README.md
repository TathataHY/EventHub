# Capa de Aplicación (eventhub-application)

Esta capa contiene los casos de uso que implementan la lógica de negocio de la aplicación EventHub.

## Estructura de Casos de Uso

Los casos de uso están organizados por entidad y funcionalidad. Cada caso de uso:
- Recibe los datos necesarios para ejecutar la operación
- Implementa la lógica de negocio específica
- Interactúa con los repositorios a través de interfaces
- Maneja excepciones del dominio
- Retorna DTOs para la capa de presentación

## Casos de Uso de Eventos (Event)

### CreateEventUseCase
- **Propósito**: Crear un nuevo evento
- **Dependencias**: EventRepository
- **Parámetros**: CreateEventDto, userId
- **Comportamiento**: 
  - Valida datos de entrada
  - Crea nueva entidad Event
  - Guarda el evento en el repositorio
  - Retorna EventDto

### UpdateEventUseCase
- **Propósito**: Actualizar un evento existente
- **Dependencias**: EventRepository
- **Parámetros**: eventId, UpdateEventDto, userId
- **Comportamiento**:
  - Verifica que el evento exista
  - Verifica que el usuario sea el organizador
  - Actualiza los campos del evento
  - Guarda los cambios
  - Retorna EventDto actualizado

### GetEventByIdUseCase
- **Propósito**: Obtener un evento por su ID
- **Dependencias**: EventRepository
- **Parámetros**: eventId
- **Comportamiento**:
  - Busca el evento por ID
  - Si no existe, lanza error
  - Retorna EventDto

### GetEventsUseCase
- **Propósito**: Obtener lista de eventos con filtros
- **Dependencias**: EventRepository
- **Parámetros**: EventFilters, page, limit
- **Comportamiento**:
  - Aplica filtros de búsqueda (organizador, fechas, etc.)
  - Implementa paginación
  - Retorna lista de EventDto y total

### AddAttendeeUseCase
- **Propósito**: Registrar un asistente a un evento
- **Dependencias**: EventRepository, UserRepository
- **Parámetros**: eventId, userId
- **Comportamiento**:
  - Verifica que el evento y usuario existan
  - Agrega al usuario como asistente
  - Guarda los cambios
  - Retorna EventDto actualizado

### RemoveAttendeeUseCase
- **Propósito**: Eliminar un asistente de un evento
- **Dependencias**: EventRepository, UserRepository
- **Parámetros**: eventId, userId
- **Comportamiento**:
  - Verifica que el evento y usuario existan
  - Elimina al usuario de los asistentes
  - Guarda los cambios
  - Retorna EventDto actualizado

### CancelEventUseCase
- **Propósito**: Cancelar un evento
- **Dependencias**: EventRepository
- **Parámetros**: eventId, userId
- **Comportamiento**:
  - Verifica que el evento exista
  - Verifica que el usuario sea el organizador
  - Marca el evento como cancelado
  - Guarda los cambios
  - Retorna EventDto actualizado

## Casos de Uso de Usuarios (User)

### CreateUserUseCase
- **Propósito**: Registrar un nuevo usuario
- **Dependencias**: UserRepository
- **Parámetros**: CreateUserDto
- **Comportamiento**:
  - Valida datos de entrada
  - Verifica que el email no esté en uso
  - Crea nueva entidad User
  - Guarda el usuario en el repositorio
  - Retorna UserDto

### GetUserByIdUseCase
- **Propósito**: Obtener un usuario por su ID
- **Dependencias**: UserRepository
- **Parámetros**: userId
- **Comportamiento**:
  - Busca el usuario por ID
  - Si no existe, lanza error
  - Retorna UserDto

### UpdateUserUseCase
- **Propósito**: Actualizar información de un usuario
- **Dependencias**: UserRepository
- **Parámetros**: userId, UpdateUserDto
- **Comportamiento**:
  - Verifica que el usuario exista
  - Actualiza los campos del usuario
  - Si se actualiza el email, verifica que no esté en uso
  - Guarda los cambios
  - Retorna UserDto actualizado

## Casos de Uso de Notificaciones (Notification)

### GetUserNotificationsUseCase
- **Propósito**: Obtener notificaciones de un usuario
- **Dependencias**: NotificationRepository
- **Parámetros**: userId, options
- **Comportamiento**:
  - Busca notificaciones por userId
  - Aplica paginación y filtros
  - Retorna lista de NotificationDto y total

### MarkNotificationReadUseCase
- **Propósito**: Marcar una notificación como leída
- **Dependencias**: NotificationRepository
- **Parámetros**: notificationId, userId
- **Comportamiento**:
  - Verifica que la notificación exista
  - Verifica que pertenezca al usuario
  - Marca como leída
  - Guarda los cambios
  - Retorna true si exitoso

### MarkAllNotificationsReadUseCase
- **Propósito**: Marcar todas las notificaciones como leídas
- **Dependencias**: NotificationRepository
- **Parámetros**: userId
- **Comportamiento**:
  - Busca todas las notificaciones no leídas del usuario
  - Marca cada una como leída
  - Guarda los cambios
  - Retorna número de notificaciones marcadas

### GetUnreadCountUseCase
- **Propósito**: Obtener el número de notificaciones no leídas
- **Dependencias**: NotificationRepository
- **Parámetros**: userId
- **Comportamiento**:
  - Cuenta las notificaciones no leídas
  - Retorna el número total

## DTOs (Data Transfer Objects)

Los DTOs son usados para transferencia de datos entre capas:

### Event DTOs
- `CreateEventDto`: Para crear eventos
- `UpdateEventDto`: Para actualizar eventos
- `EventDto`: Para respuestas de API

### User DTOs
- `CreateUserDto`: Para crear usuarios
- `UpdateUserDto`: Para actualizar usuarios
- `UserDto`: Para respuestas de API

### Notification DTOs
- `NotificationDto`: Para respuestas de API
- `NotificationPreferenceDto`: Para preferencias de notificación 