# EventHub API

API para la plataforma de gestión de eventos y notificaciones EventHub, desarrollada con arquitectura limpia (Clean Architecture).

## Estructura del proyecto

El proyecto sigue los principios de Clean Architecture con las siguientes capas:

- **Domain**: Entidades, reglas de negocio, interfaces de repositorios
- **Application**: Casos de uso, DTOs
- **Infrastructure**: Implementación de repositorios, controladores, configuración

## Requisitos

- Node.js >= 14.x
- PostgreSQL >= 13.x
- NPM >= 7.x

## Configuración para QA

### 1. Instalación de dependencias

```bash
# Instalar dependencias de todos los paquetes
npm install
```

### 2. Configuración de base de datos

Asegúrese de tener PostgreSQL instalado y funcionando. Configure las credenciales en el archivo `.env.test`.

### 3. Ejecutar pruebas

```bash
# Ejecutar las pruebas e2e
npm run test:e2e

# Ejecutar con detalle
npm run test:e2e -- --verbose
```

### 4. Iniciar servidor de pruebas

```bash
# Iniciar el servidor en modo prueba
npm run start:test
```

La documentación de la API estará disponible en: http://localhost:3001/api/docs

## Endpoints principales para pruebas

- **Salud del sistema**: GET /api/health
- **Autenticación**: POST /auth/login
- **Eventos**: GET /api/events
- **Usuarios**: GET /api/users
- **Notificaciones**: GET /api/notifications

## Entorno de pruebas

El sistema está configurado con un entorno dedicado para pruebas:

- Base de datos separada (`eventhub_test`)
- Usuario administrador predefinido:
  - Email: admin@eventhub.com
  - Password: admin123

## Ejecución de seeds para datos de prueba

```bash
# Poblar la base de datos de prueba con datos iniciales
npm run seed:test
```
