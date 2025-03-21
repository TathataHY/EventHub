# API Endpoints - EventHub

Este documento detalla los endpoints disponibles en la API de EventHub. Todos los endpoints están organizados por módulos y contienen información sobre los métodos HTTP, rutas, parámetros, body y respuestas.

## Índice
- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Eventos](#eventos)
- [Tickets](#tickets)
- [Pagos](#pagos)
- [Notificaciones](#notificaciones)
- [Comentarios](#comentarios)
- [Valoraciones](#valoraciones)
- [Categorías](#categorías)
- [Búsqueda](#búsqueda)
- [Analítica](#analítica)
- [Grupos](#grupos)
- [Webhooks](#webhooks)

## Autenticación

Endpoints para la gestión de autenticación de usuarios.

### Login

**Método:** POST  
**Ruta:** `/auth/login`  
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Respuesta:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Registro

**Método:** POST  
**Ruta:** `/auth/register`  
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Respuesta:**
```json
{
  "accessToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Recuperar Contraseña

**Método:** POST  
**Ruta:** `/auth/forgot-password`  
**Body:**
```json
{
  "email": "string"
}
```
**Respuesta:**
```json
{
  "message": "Email enviado con instrucciones para recuperar contraseña",
  "success": true
}
```

### Reiniciar Contraseña

**Método:** POST  
**Ruta:** `/auth/reset-password`  
**Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```
**Respuesta:**
```json
{
  "message": "Contraseña reiniciada con éxito",
  "success": true
}
```

### Cambiar Contraseña

**Método:** POST  
**Ruta:** `/auth/change-password`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
**Respuesta:**
```json
{
  "message": "Contraseña cambiada con éxito",
  "success": true
}
```

### Validar Token

**Método:** POST  
**Ruta:** `/auth/validate-token`  
**Body:**
```json
{
  "token": "string"
}
```
**Respuesta:**
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Obtener Perfil

**Método:** GET  
**Ruta:** `/auth/profile`  
**Protegido:** Sí (JWT)  
**Respuesta:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "profilePicture": "string"
}
```

## Usuarios

Endpoints para la gestión de usuarios.

### Obtener Usuarios

**Método:** GET  
**Ruta:** `/users`  
**Protegido:** Sí (JWT, Admin)  
**Parámetros Query:**
- `page`: número (opcional)
- `limit`: número (opcional)
- `name`: string (opcional)
- `role`: string (opcional)

**Respuesta:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "profilePicture": "string"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### Obtener Usuario por ID

**Método:** GET  
**Ruta:** `/users/{id}`  
**Protegido:** Sí (JWT)  
**Respuesta:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "profilePicture": "string",
  "bio": "string",
  "createdAt": "string"
}
```

### Actualizar Usuario

**Método:** PATCH  
**Ruta:** `/users/{id}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Body:**
```json
{
  "name": "string",
  "bio": "string",
  "profilePicture": "string"
}
```
**Respuesta:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "profilePicture": "string",
  "bio": "string",
  "updatedAt": "string"
}
```

### Subir Imagen de Perfil

**Método:** POST  
**Ruta:** `/users/{id}/profile-image`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Body:** Form Data (file)  
**Respuesta:**
```json
{
  "profilePicture": "string",
  "success": true
}
```

### Eliminar Usuario

**Método:** DELETE  
**Ruta:** `/users/{id}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Respuesta:**
```json
{
  "message": "Usuario eliminado con éxito",
  "success": true
}
```

## Eventos

Endpoints para la gestión de eventos.

### Crear Evento

**Método:** POST  
**Ruta:** `/events`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "locationLat": 0,
  "locationLng": 0,
  "startDate": "string",
  "endDate": "string",
  "maxAttendees": 0,
  "price": 0,
  "categoryIds": ["string"],
  "coverImage": "string"
}
```
**Respuesta:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "organizer": {
    "id": "string",
    "name": "string"
  },
  "location": "string",
  "startDate": "string",
  "endDate": "string",
  "maxAttendees": 0,
  "price": 0,
  "isPublished": false,
  "coverImage": "string",
  "categories": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "createdAt": "string"
}
```

### Obtener Eventos

**Método:** GET  
**Ruta:** `/events`  
**Parámetros Query:**
- `page`: número (opcional)
- `limit`: número (opcional)
- `organizerId`: string (opcional)
- `isActive`: booleano (opcional)
- `startDate`: fecha (opcional)
- `endDate`: fecha (opcional)
- `query`: string (opcional)
- `tags`: array de strings (opcional)

**Respuesta:**
```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "organizer": {
        "id": "string",
        "name": "string"
      },
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "price": 0,
      "coverImage": "string"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### Obtener Evento por ID

**Método:** GET  
**Ruta:** `/events/{id}`  
**Respuesta:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "organizer": {
    "id": "string",
    "name": "string"
  },
  "location": "string",
  "locationLat": 0,
  "locationLng": 0,
  "startDate": "string",
  "endDate": "string",
  "maxAttendees": 0,
  "price": 0,
  "isPublished": true,
  "coverImage": "string",
  "categories": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "attendees": [
    {
      "id": "string",
      "name": "string",
      "profilePicture": "string"
    }
  ],
  "createdAt": "string"
}
```

### Actualizar Evento

**Método:** PATCH  
**Ruta:** `/events/{id}`  
**Protegido:** Sí (JWT, Organizador o Admin)  
**Body:**
```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "locationLat": 0,
  "locationLng": 0,
  "startDate": "string",
  "endDate": "string",
  "maxAttendees": 0,
  "price": 0,
  "categoryIds": ["string"],
  "coverImage": "string",
  "isPublished": true
}
```
**Respuesta:** Objeto de evento actualizado

### Subir Imagen de Evento

**Método:** POST  
**Ruta:** `/events/{id}/image`  
**Protegido:** Sí (JWT, Organizador o Admin)  
**Body:** Form Data (file)  
**Respuesta:**
```json
{
  "id": "string",
  "coverImage": "string",
  "success": true
}
```

### Agregar Asistente

**Método:** POST  
**Ruta:** `/events/{id}/attendees/{userId}`  
**Protegido:** Sí (JWT, Admin)  
**Respuesta:** Objeto de evento actualizado

### Eliminar Asistente

**Método:** DELETE  
**Ruta:** `/events/{id}/attendees/{userId}`  
**Protegido:** Sí (JWT, Admin u Organizador)  
**Respuesta:** Objeto de evento actualizado

### Cancelar Evento

**Método:** PATCH  
**Ruta:** `/events/{id}/cancel`  
**Protegido:** Sí (JWT, Organizador o Admin)  
**Respuesta:** Objeto de evento actualizado

## Tickets

Endpoints para la gestión de tickets de eventos.

### Crear Ticket

**Método:** POST  
**Ruta:** `/tickets`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "eventId": "string",
  "userId": "string",
  "price": 0,
  "description": "string",
  "validFrom": "string",
  "validUntil": "string"
}
```
**Respuesta:**
```json
{
  "id": "string",
  "code": "string",
  "event": {
    "id": "string",
    "title": "string"
  },
  "user": {
    "id": "string",
    "name": "string"
  },
  "price": 0,
  "status": "pending",
  "isUsed": false,
  "validFrom": "string",
  "validUntil": "string",
  "createdAt": "string"
}
```

### Obtener Tickets por Usuario

**Método:** GET  
**Ruta:** `/tickets/user/{userId}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Respuesta:** Lista de tickets

### Obtener Tickets por Evento

**Método:** GET  
**Ruta:** `/tickets/event/{eventId}`  
**Protegido:** Sí (JWT, Organizador o Admin)  
**Respuesta:** Lista de tickets

### Obtener Ticket por ID

**Método:** GET  
**Ruta:** `/tickets/{id}`  
**Protegido:** Sí (JWT, Dueño, Organizador o Admin)  
**Respuesta:** Objeto de ticket

### Validar Ticket

**Método:** PATCH  
**Ruta:** `/tickets/{id}/validate`  
**Protegido:** Sí (JWT, Organizador o Admin)  
**Respuesta:**
```json
{
  "id": "string",
  "isUsed": true,
  "status": "used",
  "validatedAt": "string",
  "success": true
}
```

### Cancelar Ticket

**Método:** PATCH  
**Ruta:** `/tickets/{id}/cancel`  
**Protegido:** Sí (JWT, Dueño, Organizador o Admin)  
**Respuesta:** Objeto de ticket actualizado

## Pagos

Endpoints para la gestión de pagos.

### Crear Pago

**Método:** POST  
**Ruta:** `/payments`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "userId": "string",
  "eventId": "string",
  "amount": 0,
  "paymentMethod": "string",
  "paymentProvider": "string",
  "paymentType": "event_ticket"
}
```
**Respuesta:**
```json
{
  "id": "string",
  "user": {
    "id": "string",
    "name": "string"
  },
  "event": {
    "id": "string",
    "title": "string"
  },
  "amount": 0,
  "paymentMethod": "string",
  "status": "pending",
  "paymentUrl": "string",
  "createdAt": "string"
}
```

### Obtener Pagos por Usuario

**Método:** GET  
**Ruta:** `/payments/user/{userId}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Respuesta:** Lista de pagos

### Obtener Pago por ID

**Método:** GET  
**Ruta:** `/payments/{id}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Respuesta:** Objeto de pago

### Confirmar Pago

**Método:** PATCH  
**Ruta:** `/payments/{id}/confirm`  
**Protegido:** Sí (JWT, Admin)  
**Respuesta:** Objeto de pago actualizado

### Reembolsar Pago

**Método:** PATCH  
**Ruta:** `/payments/{id}/refund`  
**Protegido:** Sí (JWT, Admin)  
**Respuesta:** Objeto de pago actualizado

## Notificaciones

Endpoints para la gestión de notificaciones.

### Obtener Notificaciones por Usuario

**Método:** GET  
**Ruta:** `/notifications/user/{userId}`  
**Protegido:** Sí (JWT, Dueño)  
**Parámetros Query:**
- `page`: número (opcional)
- `limit`: número (opcional)
- `read`: booleano (opcional)

**Respuesta:**
```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "type": "string",
      "read": false,
      "createdAt": "string"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Obtener Notificación por ID

**Método:** GET  
**Ruta:** `/notifications/{id}`  
**Protegido:** Sí (JWT, Dueño)  
**Respuesta:** Objeto de notificación detallado

### Marcar Notificación como Leída

**Método:** PATCH  
**Ruta:** `/notifications/{id}/read`  
**Protegido:** Sí (JWT, Dueño)  
**Respuesta:**
```json
{
  "id": "string",
  "read": true,
  "readAt": "string",
  "success": true
}
```

### Marcar Todas las Notificaciones como Leídas

**Método:** PATCH  
**Ruta:** `/notifications/user/{userId}/read-all`  
**Protegido:** Sí (JWT, Dueño)  
**Respuesta:**
```json
{
  "count": 10,
  "success": true
}
```

### Actualizar Preferencias de Notificación

**Método:** PATCH  
**Ruta:** `/notifications/preferences`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "notificationType": "event",
  "emailEnabled": true,
  "pushEnabled": true,
  "inAppEnabled": true,
  "smsEnabled": false
}
```
**Respuesta:** Objeto de preferencias actualizado

## Comentarios

Endpoints para la gestión de comentarios.

### Crear Comentario

**Método:** POST  
**Ruta:** `/comments`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "eventId": "string",
  "content": "string",
  "parentId": "string" // Opcional
}
```
**Respuesta:** Objeto de comentario creado

### Obtener Comentarios por Evento

**Método:** GET  
**Ruta:** `/comments/event/{eventId}`  
**Parámetros Query:**
- `page`: número (opcional)
- `limit`: número (opcional)

**Respuesta:** Lista de comentarios

### Obtener Comentario por ID

**Método:** GET  
**Ruta:** `/comments/{id}`  
**Respuesta:** Objeto de comentario detallado

### Actualizar Comentario

**Método:** PATCH  
**Ruta:** `/comments/{id}`  
**Protegido:** Sí (JWT, Dueño)  
**Body:**
```json
{
  "content": "string"
}
```
**Respuesta:** Objeto de comentario actualizado

### Eliminar Comentario

**Método:** DELETE  
**Ruta:** `/comments/{id}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Respuesta:**
```json
{
  "success": true
}
```

## Valoraciones

Endpoints para la gestión de valoraciones.

### Crear Valoración

**Método:** POST  
**Ruta:** `/ratings`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "eventId": "string",
  "score": 5,
  "comment": "string" // Opcional
}
```
**Respuesta:** Objeto de valoración creado

### Obtener Valoraciones por Evento

**Método:** GET  
**Ruta:** `/ratings/event/{eventId}`  
**Parámetros Query:**
- `page`: número (opcional)
- `limit`: número (opcional)

**Respuesta:** Lista de valoraciones

### Obtener Valoración por ID

**Método:** GET  
**Ruta:** `/ratings/{id}`  
**Respuesta:** Objeto de valoración detallado

### Actualizar Valoración

**Método:** PATCH  
**Ruta:** `/ratings/{id}`  
**Protegido:** Sí (JWT, Dueño)  
**Body:**
```json
{
  "score": 4,
  "comment": "string"
}
```
**Respuesta:** Objeto de valoración actualizado

### Eliminar Valoración

**Método:** DELETE  
**Ruta:** `/ratings/{id}`  
**Protegido:** Sí (JWT, Dueño o Admin)  
**Respuesta:**
```json
{
  "success": true
}
```

## Categorías

Endpoints para la gestión de categorías de eventos.

### Crear Categoría

**Método:** POST  
**Ruta:** `/categories`  
**Protegido:** Sí (JWT, Admin)  
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "icon": "string"
}
```
**Respuesta:** Objeto de categoría creado

### Obtener Categorías

**Método:** GET  
**Ruta:** `/categories`  
**Respuesta:** Lista de categorías

### Obtener Categoría por ID

**Método:** GET  
**Ruta:** `/categories/{id}`  
**Respuesta:** Objeto de categoría detallado

### Actualizar Categoría

**Método:** PATCH  
**Ruta:** `/categories/{id}`  
**Protegido:** Sí (JWT, Admin)  
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "icon": "string"
}
```
**Respuesta:** Objeto de categoría actualizado

### Eliminar Categoría

**Método:** DELETE  
**Ruta:** `/categories/{id}`  
**Protegido:** Sí (JWT, Admin)  
**Respuesta:**
```json
{
  "success": true
}
```

## Búsqueda

Endpoints para la búsqueda de elementos en la plataforma.

### Búsqueda Global

**Método:** GET  
**Ruta:** `/search`  
**Parámetros Query:**
- `query`: string (requerido)
- `type`: string (opcional) - "events", "users", "groups"
- `page`: número (opcional)
- `limit`: número (opcional)

**Respuesta:**
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "startDate": "string"
    }
  ],
  "users": [
    {
      "id": "string",
      "name": "string",
      "profilePicture": "string"
    }
  ],
  "groups": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### Búsqueda de Eventos

**Método:** GET  
**Ruta:** `/search/events`  
**Parámetros Query:**
- `query`: string (requerido)
- `categories`: array de strings (opcional)
- `startDate`: fecha (opcional)
- `endDate`: fecha (opcional)
- `page`: número (opcional)
- `limit`: número (opcional)

**Respuesta:** Lista filtrada de eventos

### Búsqueda de Usuarios

**Método:** GET  
**Ruta:** `/search/users`  
**Protegido:** Sí (JWT)  
**Parámetros Query:**
- `query`: string (requerido)
- `page`: número (opcional)
- `limit`: número (opcional)

**Respuesta:** Lista filtrada de usuarios

## Analítica

Endpoints para obtener analítica y estadísticas.

### Estadísticas de Eventos

**Método:** GET  
**Ruta:** `/analytics/events`  
**Protegido:** Sí (JWT, Admin)  
**Parámetros Query:**
- `period`: string ("day", "week", "month", "year")
- `startDate`: fecha (opcional)
- `endDate`: fecha (opcional)

**Respuesta:**
```json
{
  "totalEvents": 100,
  "eventsByStatus": {
    "draft": 10,
    "published": 80,
    "cancelled": 5,
    "finished": 5
  },
  "eventsByCategory": [
    {
      "category": "Música",
      "count": 40
    },
    {
      "category": "Tecnología",
      "count": 30
    }
  ],
  "trendsOverTime": [
    {
      "date": "2023-10-01",
      "count": 5
    },
    {
      "date": "2023-10-02",
      "count": 7
    }
  ]
}
```

### Estadísticas de Usuarios

**Método:** GET  
**Ruta:** `/analytics/users`  
**Protegido:** Sí (JWT, Admin)  
**Parámetros Query:**
- `period`: string ("day", "week", "month", "year")
- `startDate`: fecha (opcional)
- `endDate`: fecha (opcional)

**Respuesta:** Estadísticas detalladas de usuarios

### Estadísticas de Pagos

**Método:** GET  
**Ruta:** `/analytics/payments`  
**Protegido:** Sí (JWT, Admin)  
**Parámetros Query:**
- `period`: string ("day", "week", "month", "year")
- `startDate`: fecha (opcional)
- `endDate`: fecha (opcional)

**Respuesta:** Estadísticas detalladas de pagos

## Grupos

Endpoints para la gestión de grupos.

### Crear Grupo

**Método:** POST  
**Ruta:** `/groups`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "isPublic": true
}
```
**Respuesta:** Objeto de grupo creado

### Obtener Grupos

**Método:** GET  
**Ruta:** `/groups`  
**Parámetros Query:**
- `page`: número (opcional)
- `limit`: número (opcional)
- `query`: string (opcional)

**Respuesta:** Lista de grupos

### Obtener Grupo por ID

**Método:** GET  
**Ruta:** `/groups/{id}`  
**Respuesta:** Objeto de grupo detallado

### Actualizar Grupo

**Método:** PATCH  
**Ruta:** `/groups/{id}`  
**Protegido:** Sí (JWT, Admin de grupo)  
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "isPublic": true
}
```
**Respuesta:** Objeto de grupo actualizado

### Agregar Miembro

**Método:** POST  
**Ruta:** `/groups/{id}/members`  
**Protegido:** Sí (JWT)  
**Body:**
```json
{
  "userId": "string",
  "role": "member"
}
```
**Respuesta:**
```json
{
  "id": "string",
  "userId": "string",
  "groupId": "string",
  "role": "member",
  "status": "active",
  "joinedAt": "string",
  "success": true
}
```

### Obtener Miembros de Grupo

**Método:** GET  
**Ruta:** `/groups/{id}/members`  
**Respuesta:** Lista de miembros del grupo

### Eliminar Miembro

**Método:** DELETE  
**Ruta:** `/groups/{id}/members/{userId}`  
**Protegido:** Sí (JWT, Admin de grupo o miembro)  
**Respuesta:**
```json
{
  "success": true
}
```

### Actualizar Rol de Miembro

**Método:** PATCH  
**Ruta:** `/groups/{id}/members/{userId}/role`  
**Protegido:** Sí (JWT, Admin de grupo)  
**Body:**
```json
{
  "role": "moderator"
}
```
**Respuesta:** Objeto miembro actualizado

## Webhooks

Endpoints para la gestión de webhooks y callbacks.

### Webhook de Pago

**Método:** POST  
**Ruta:** `/webhooks/payment/{provider}`  
**Body:** Varía según el proveedor  
**Respuesta:**
```json
{
  "received": true
}
```

### Webhook de Notificación

**Método:** POST  
**Ruta:** `/webhooks/notification/{provider}`  
**Body:** Varía según el proveedor  
**Respuesta:**
```json
{
  "received": true
}
``` 