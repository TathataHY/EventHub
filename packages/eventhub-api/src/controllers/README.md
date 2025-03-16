# Controladores de API (eventhub-api)

Los controladores exponen la funcionalidad de la aplicación a través de endpoints REST. Utilizan los casos de uso de la capa de aplicación para implementar la lógica de negocio.

## Estructura General

Cada controlador:
- Se asocia a una ruta base
- Define métodos para manejar diferentes verbos HTTP (GET, POST, etc.)
- Valida datos de entrada con DTOs
- Invoca casos de uso apropiados
- Maneja errores y excepciones
- Retorna respuestas HTTP adecuadas

## Controladores Implementados

### EventController (`/events`)

Maneja la gestión de eventos en la plataforma.

#### Endpoints:

| Método | Ruta | Descripción | Caso de Uso | Autenticación |
|--------|------|-------------|------------|---------------|
| `POST` | `/events` | Crear nuevo evento | CreateEventUseCase | Sí |
| `GET` | `/events` | Listar eventos con filtros | GetEventsUseCase | No |
| `GET` | `/events/:id` | Obtener evento por ID | GetEventByIdUseCase | No |
| `PATCH` | `/events/:id` | Actualizar evento | UpdateEventUseCase | Sí (Organizador) |
| `POST` | `/events/:id/attendees/:userId` | Registrar asistente | AddAttendeeUseCase | Sí |
| `DELETE` | `/events/:id/attendees/:userId` | Eliminar asistente | RemoveAttendeeUseCase | Sí |
| `PATCH` | `/events/:id/cancel` | Cancelar evento | CancelEventUseCase | Sí (Organizador) |

#### Filtros de eventos:
- `organizerId`: Filtrar por organizador
- `isActive`: Eventos activos/cancelados
- `startDate`: Fecha mínima de inicio
- `endDate`: Fecha máxima de fin
- `query`: Búsqueda en título/descripción
- `tags`: Filtrar por etiquetas
- `page` y `limit`: Paginación

### UserController (`/users`)

Gestiona usuarios y perfiles.

#### Endpoints:

| Método | Ruta | Descripción | Caso de Uso | Autenticación |
|--------|------|-------------|------------|---------------|
| `POST` | `/users` | Registrar nuevo usuario | CreateUserUseCase | No |
| `GET` | `/users/me` | Obtener perfil actual | GetUserByIdUseCase | Sí |
| `GET` | `/users/:id` | Obtener usuario por ID | GetUserByIdUseCase | Sí |
| `PATCH` | `/users/:id` | Actualizar perfil | UpdateUserUseCase | Sí (Mismo usuario o Admin) |

### NotificationController (`/notifications`)

Maneja las notificaciones de usuarios.

#### Endpoints:

| Método | Ruta | Descripción | Caso de Uso | Autenticación |
|--------|------|-------------|------------|---------------|
| `GET` | `/notifications` | Listar notificaciones | GetUserNotificationsUseCase | Sí |
| `GET` | `/notifications/unread` | Contar no leídas | GetUnreadCountUseCase | Sí |
| `PUT` | `/notifications/:id/read` | Marcar como leída | MarkNotificationReadUseCase | Sí |
| `PUT` | `/notifications/read-all` | Marcar todas como leídas | MarkAllNotificationsReadUseCase | Sí |

## Middleware y Seguridad

### Autenticación

- `JwtAuthGuard`: Protege rutas que requieren autenticación
- `@User()` decorator: Proporciona acceso al usuario en las rutas protegidas

### Validación

- Validación automática usando los decoradores de DTOs
- Transformación de tipos de datos
- Filtrado de propiedades no permitidas

### Manejo de Errores

- Conversión de excepciones de dominio a respuestas HTTP apropiadas
- Mensajes de error descriptivos y códigos HTTP adecuados:
  - 400: Bad Request (datos inválidos)
  - 401: Unauthorized (no autenticado)
  - 403: Forbidden (no autorizado)
  - 404: Not Found (recurso no existe)
  - 500: Internal Server Error (error inesperado)

## Documentación de API (Swagger)

Todos los endpoints están documentados usando decoradores de Swagger:
- `@ApiTags`: Agrupación de endpoints
- `@ApiOperation`: Descripción del endpoint
- `@ApiResponse`: Tipos de respuestas posibles
- `@ApiParam`: Parámetros de ruta
- `@ApiQuery`: Parámetros de consulta
- `@ApiBody`: Estructura del cuerpo de la petición

La documentación completa está disponible en `/api-docs` cuando la aplicación está en ejecución. 