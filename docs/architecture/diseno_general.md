# Documento de Análisis y Diseño - EventHub

## 1. Introducción

EventHub es una aplicación móvil dedicada a la gestión completa de eventos tanto sociales como de negocios. Permite a los usuarios crear, publicar, buscar y asistir a eventos, así como interactuar con otros asistentes.

## 2. Arquitectura del Sistema

### 2.1 Componentes Principales
- **Monorepo (Yarn Workspaces)**: Estructura que permite compartir código entre aplicaciones
- **Paquete Compartido (eventhub-shared)**: Tipos y modelos compartidos entre frontend y backend
- **Frontend Mobile (eventhub-mobile)**: Aplicación móvil para iOS y Android con Expo y Expo Router
- **Backend (eventhub-api)**: API RESTful con NestJS y autenticación JWT
- **Base de Datos (MySQL)**: Almacenamiento relacional con TypeORM como ORM
- **Servicios Cloud**: Almacenamiento de archivos, notificaciones push, procesamiento de pagos, etc.

### 2.2 Estructura del Monorepo

```
EventHub/
├── packages/                      # Directorio de paquetes del monorepo
│   ├── eventhub-shared/           # Tipos y modelos compartidos
│   ├── eventhub-api/              # Backend (NestJS con Clean Architecture)
│   └── eventhub-mobile/           # Frontend móvil (React Native/Expo)
├── docs/                          # Documentación
└── bitbucket-pipelines.yml        # Configuración de CI/CD
```

### 2.3 Patrón de Arquitectura
El sistema sigue los principios de **Clean Architecture** tanto en el backend como en el frontend:

- **Capa de Dominio**: Entidades y reglas de negocio
- **Capa de Aplicación**: Casos de uso y servicios
- **Capa de Infraestructura**: Implementación de repositorios y servicios externos
- **Capa de Presentación**: Controladores API en backend y componentes UI en frontend

## 3. Modelo de Datos

### 3.1 Entidades Principales
- **Usuarios**: Información básica y de perfil
- **Eventos**: Información de eventos, ubicación, etc.
- **Categorías**: Clasificación de los eventos
- **Asistencias**: Relación entre usuarios y eventos
- **Tickets**: Entradas para eventos
- **Pagos**: Información de transacciones
- **Comentarios**: Opiniones sobre eventos
- **Grupos**: Asistentes agrupados por intereses
- **Evaluaciones**: Calificaciones post-evento

### 3.2 Relaciones entre Entidades
- Un usuario puede ser organizador de múltiples eventos
- Un usuario puede asistir a múltiples eventos
- Un evento pertenece a una categoría
- Las asistencias generan tickets para control de acceso
- Los pagos están asociados a usuarios y tickets
- Los comentarios están vinculados a eventos específicos

## 4. Funcionalidades Principales

### 4.1 Gestión de Usuarios
- Registro y autenticación (sistema propio y APIs de terceros)
- Perfiles de usuario (preferencias, intereses)
- Roles: administrador, organizador, usuario regular

### 4.2 Gestión de Eventos
- Creación y publicación de eventos
- Búsqueda y filtrado de eventos
- Asistencia a eventos
- Evaluación de eventos

### 4.3 Interacción Social
- Comentarios en eventos
- Creación de grupos dentro de eventos
- Notificaciones de eventos y actividades
- Compartir eventos en redes sociales

### 4.4 Pagos y Tickets
- Procesamiento de pagos para eventos de pago
- Generación de tickets con códigos QR
- Verificación de entradas en entrada a eventos
- Historial de compras y asistencias

## 5. Navegación Frontend (Expo Router)

La aplicación móvil utilizará Expo Router para implementar una navegación basada en archivos:

```
app/
├── _layout.js              # Layout raíz
├── index.js                # Pantalla inicial (/)
├── (auth)/                 # Grupo de autenticación
│   ├── _layout.js          # Layout para autenticación
│   ├── login.js            # Pantalla de login (/login)
│   ├── register.js         # Pantalla de registro (/register)
├── (tabs)/                 # Grupo de pestañas principales 
│   ├── _layout.js          # Layout de pestañas
│   ├── home.js             # Pestaña Home (/home)
│   ├── search.js           # Pestaña Búsqueda (/search)
├── events/                 # Rutas para eventos
│   ├── [id].js             # Detalle de evento (/events/123)
│   ├── create.js           # Crear evento (/events/create)
├── payments/               # Rutas para pagos
│   ├── checkout/[eventId].js # Checkout (/payments/checkout/123)
```

## 6. API y Endpoints

La API sigue una estructura RESTful con los siguientes endpoints principales:

- **Auth**: `/api/auth` - Autenticación y gestión de usuarios
- **Events**: `/api/events` - CRUD de eventos
- **Categories**: `/api/categories` - Categorías de eventos
- **Attendances**: `/api/attendances` - Asistencia a eventos
- **Payments**: `/api/payments` - Procesamiento de pagos
- **Comments**: `/api/comments` - Comentarios en eventos
- **Groups**: `/api/groups` - Grupos dentro de eventos

## 7. Consideraciones de Seguridad
- Autenticación JWT con refresh tokens
- Cifrado de datos sensibles
- Validación de entradas con Class Validator
- Permisos y control de acceso basado en roles
- Protección contra ataques comunes (XSS, CSRF, etc.)

## 8. Plan de Implementación
1. Configuración del monorepo y paquetes compartidos
2. Desarrollo del backend con Clean Architecture
3. Desarrollo del frontend mobile con Expo Router
4. Integración de servicios cloud
5. Pruebas y depuración
6. Despliegue y publicación en app stores 