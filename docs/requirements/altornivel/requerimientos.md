# Requerimientos de Alto Nivel - EventHub

## Descripción de la Aplicación

EventHub es una aplicación móvil diseñada para gestionar eventos sociales, negocios, eventos de oferta, entre otros tipos de eventos.

## Tabla de Requerimientos

| **ID** | **Requerimiento** | **Usuario** | **Extend** |
|--------|-------------------|-------------|------------|
| 1 | Registrar con credenciales del sistema | Organizador, Usuario | |
| 2 | Registrar con API (cuenta de Google, Facebook, etc.) | | |
| 3 | Login | Organizador, Usuario | |
| 4 | Generar un evento | Organizador | |
| 5 | Buscar eventos | Usuario | |
| 6 | Eliminar evento | Administrador | |
| 7 | Bloquear usuario | Administrador | |
| 8 | Actualizar intereses | Administrador | |
| 9 | Listar eventos | Administrador | |
| 10 | Publicar evento | Organizador | Generar un evento |
| 11 | Actualizar evento | Organizador | Generar un evento |
| 12 | Pagar organización evento | Organizador | Publicar evento |
| 13 | Asistir a evento | Usuario | Chatear con asistentes de evento |
| 14 | Consultar historial de eventos asistido | Usuario | |
| 15 | Configuración de filtro de evento | | |
| 16 | Configurar perfil de usuario (preferencias, encuestas, etc.) | | |
| 17 | Configuración de sistema (sonido, notificaciones, etc.) | | |
| 18 | Validación y autenticar usuario | | |
| 19 | Confirmar asistencia | | |
| 20 | Cancelar asistencia | | |
| 21 | Cancelar membresía | | |
| 22 | Agregar medio de pago | | |
| 23 | Seguir evento | | |
| 24 | Crear grupo | | |
| 25 | Asignar límite de personas al evento | | |
| 26 | Ingresar al chat | | |
| 27 | Configuración de chat | | |
| 28 | Configuración de membresía | | |
| 29 | Mostrar notificación de evento | | |
| 30 | Ver perfil de asistencia de usuarios | | |
| 31 | Ver eventos y categorías de usuarios | | |
| 32 | Comparar perfiles entre usuarios | | |
| 33 | Evaluación de evento | | |
| 34 | Evaluación de afinidad con usuarios asistentes | | |
| 35 | Habilitar evento | | |
| 36 | Ocultar evento | | |
| 37 | Cancelar evento | | |
| 38 | Notificar asistencia de usuario afín | | |
| 39 | Ocultar opción de seguimiento | | |
| 40 | Eliminar chat | | |
| 41 | Configuración de visibilidad de datos de usuario | | |
| 42 | Abandonar chat | | |
| 43 | Gestionar visibilidad de evento (personalización) | | |
| 44 | Denunciar usuario | | |
| 45 | Ignorar usuario | | |
| 46 | Denunciar evento | | |

## Agrupación de Requerimientos por Módulo

### Módulo de Autenticación
- Registrar con credenciales del sistema
- Registrar con API (Google, Facebook)
- Login
- Validación y autenticación de usuario

### Módulo de Gestión de Usuarios
- Configurar perfil de usuario
- Bloquear usuario
- Denunciar usuario
- Ignorar usuario
- Configuración de visibilidad de datos de usuario

### Módulo de Gestión de Eventos
- Generar un evento
- Publicar evento
- Actualizar evento
- Eliminar evento
- Cancelar evento
- Habilitar evento
- Ocultar evento
- Asignar límite de personas al evento
- Listar eventos
- Gestionar visibilidad de evento

### Módulo de Búsqueda y Asistencia
- Buscar eventos
- Configuración de filtro de evento
- Asistir a evento
- Confirmar asistencia
- Cancelar asistencia
- Seguir evento
- Ocultar opción de seguimiento

### Módulo de Interacción Social
- Chatear con asistentes de evento
- Ingresar al chat
- Configuración de chat
- Abandonar chat
- Eliminar chat
- Crear grupo
- Ver perfil de asistencia de usuarios
- Ver eventos y categorías de usuarios
- Comparar perfiles entre usuarios
- Evaluación de afinidad con usuarios asistentes
- Notificar asistencia de usuario afín

### Módulo de Pagos y Membresía
- Pagar organización evento
- Agregar medio de pago
- Configuración de membresía
- Cancelar membresía

### Módulo de Evaluación y Estadísticas
- Evaluación de evento
- Consultar historial de eventos asistido

### Módulo de Configuración del Sistema
- Configuración de sistema (sonido, notificaciones)
- Mostrar notificación de evento
- Actualizar intereses 