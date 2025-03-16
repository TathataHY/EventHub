# Capa de Dominio (eventhub-domain)

Esta capa contiene las entidades del dominio y las reglas de negocio esenciales para la aplicación EventHub.

## Entidades

### Event (Evento)

Representa un evento que se realiza en una fecha y lugar específicos.

**Propiedades principales:**
- `id`: Identificador único del evento
- `title`: Título del evento
- `description`: Descripción detallada
- `startDate`: Fecha y hora de inicio
- `endDate`: Fecha y hora de finalización
- `location`: Ubicación del evento
- `organizerId`: ID del usuario organizador
- `capacity`: Capacidad máxima de asistentes
- `attendees`: Lista de IDs de usuarios asistentes
- `isActive`: Indica si el evento está activo o cancelado
- `tags`: Etiquetas para categorizar el evento

**Reglas de negocio:**
- El título y la descripción son obligatorios
- La fecha de inicio debe ser anterior a la fecha de fin
- La capacidad debe ser mayor a cero
- Un asistente no puede registrarse dos veces
- No se pueden agregar asistentes a un evento cancelado
- No se pueden agregar asistentes si se alcanzó la capacidad máxima

**Métodos principales:**
- `addAttendee(userId)`: Agrega un asistente
- `removeAttendee(userId)`: Elimina un asistente
- `cancelEvent()`: Cancela el evento
- `isOrganizer(userId)`: Verifica si un usuario es el organizador
- `hasAvailableCapacity()`: Verifica si hay espacio disponible

### User (Usuario)

Representa un usuario del sistema.

**Propiedades principales:**
- `id`: Identificador único
- `name`: Nombre completo
- `email`: Correo electrónico (único)
- `password`: Contraseña (hash)
- `role`: Rol del usuario (USER, ADMIN, ORGANIZER)
- `isActive`: Estado del usuario

**Reglas de negocio:**
- Email y nombre son obligatorios
- Email debe tener formato válido
- La contraseña debe cumplir con requisitos mínimos de seguridad
- El rol debe ser uno de los permitidos

**Métodos principales:**
- `updatePassword(newPassword)`: Actualiza la contraseña
- `activate()`: Activa la cuenta
- `deactivate()`: Desactiva la cuenta
- `isAdmin()`: Verifica si es administrador

### Notification (Notificación)

Representa una notificación enviada a un usuario.

**Propiedades principales:**
- `id`: Identificador único
- `userId`: ID del usuario destinatario
- `title`: Título de la notificación
- `message`: Contenido de la notificación
- `type`: Tipo de notificación (EVENT_INVITATION, EVENT_UPDATE, etc.)
- `read`: Indica si la notificación ha sido leída
- `createdAt`: Fecha de creación

**Reglas de negocio:**
- Debe estar asociada a un usuario existente
- Debe tener título y mensaje
- El tipo debe ser uno de los permitidos

**Métodos principales:**
- `markAsRead()`: Marca la notificación como leída

## Value Objects

### Role (Rol)

Value object para representar roles de usuario.

**Valores permitidos:**
- `USER`: Usuario regular
- `ADMIN`: Administrador del sistema
- `ORGANIZER`: Organizador de eventos

## Excepciones

Las excepciones del dominio están organizadas por entidad:

### Event
- `EventCreateException`: Error al crear un evento
- `EventUpdateException`: Error al actualizar un evento
- `EventAttendanceException`: Error en gestión de asistentes

### User
- `UserCreateException`: Error al crear un usuario
- `UserUpdateException`: Error al actualizar un usuario

### Notification
- `NotificationCreateException`: Error al crear una notificación

## Repositorios (Interfaces)

Las interfaces de repositorio definen los contratos para acceder a datos:

- `EventRepository`: Operaciones CRUD para eventos
- `UserRepository`: Operaciones CRUD para usuarios
- `NotificationRepository`: Operaciones CRUD para notificaciones

Estas interfaces son implementadas en la capa de infraestructura. 