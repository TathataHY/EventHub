# Guía de Reorganización de EventHub API

Este documento describe el plan para reorganizar la estructura de archivos de la API de EventHub, eliminando duplicaciones y siguiendo mejores prácticas de arquitectura.

## Problemas Identificados

1. **Duplicación de Archivos y Estructura**:
   - Decoradores en múltiples ubicaciones (`/decorators`, `/common/decorators`, `/infrastructure/decorators`)
   - Guards en múltiples ubicaciones (`/guards`, `/common/guards`, `/infrastructure/guards`)
   - Filtros en múltiples ubicaciones (`/common/filters`, `/infrastructure/filters`)
   - Controladores duplicados o fragmentados entre múltiples carpetas

2. **Confusión de Responsabilidades**:
   - Mezcla de código entre la capa API e infraestructura
   - No está claro qué debe ir en cada ubicación

3. **Estructura Inconsistente**:
   - Diferentes convenciones de nomenclatura (PascalCase vs. kebab-case)
   - Diferentes patrones de organización en distintas partes del código

## Nueva Estructura Propuesta

```
src/
├── controllers/           # Controladores de la API (endpoints)
├── common/                # Código común para toda la aplicación
│   ├── decorators/        # Decoradores personalizados (roles, auth, etc.)
│   ├── filters/           # Filtros de excepciones HTTP
│   ├── guards/            # Guards de autenticación/autorización
│   ├── interceptors/      # Interceptores de solicitudes HTTP
│   ├── interfaces/        # Interfaces comunes (JWT payload, etc.)
│   ├── pipes/             # Pipes de validación
│   └── utils/             # Utilidades comunes
├── config/                # Configuraciones de la aplicación
│   ├── env/               # Configuraciones por entorno
│   ├── swagger/           # Configuración de Swagger
│   └── typeorm/           # Configuración de TypeORM
├── app.module.ts          # Módulo principal de la aplicación
└── main.ts                # Punto de entrada de la aplicación
```

## Plan de Migración

### 1. Consolidar Decoradores

- Mover todos los decoradores a `src/common/decorators/`
- Verificar y eliminar duplicados
- Actualizar importaciones en todo el proyecto

#### Decoradores a Consolidar:
- `roles.decorator.ts`
- `public.decorator.ts`
- `user.decorator.ts`
- `permissions.decorator.ts`
- `current-user.decorator.ts`

### 2. Consolidar Guards

- Mover todos los guards a `src/common/guards/`
- Verificar y eliminar duplicados
- Actualizar importaciones en todo el proyecto

#### Guards a Consolidar:
- `jwt-auth.guard.ts`
- `roles.guard.ts`
- `permissions.guard.ts`

### 3. Consolidar Filtros

- Mover todos los filtros a `src/common/filters/`
- Verificar y eliminar duplicados
- Actualizar importaciones en todo el proyecto

#### Filtros a Consolidar:
- `http-exception.filter.ts`

### 4. Reorganizar Módulos

- Mantener solo el `app.module.ts` en la raíz
- Importar módulos desde la capa de infraestructura
- Eliminar módulos duplicados en `/infrastructure/modules/

### 5. Consolidar Controladores

- Verificar que todos los controladores estén en `src/controllers/`
- Eliminar controladores duplicados en `/infrastructure/controllers/`
- Actualizar `app.module.ts` con todos los controladores

### 6. Crear Carpeta de Configuración

- Crear `src/config/` para centralizar configuraciones
- Mover configuraciones de TypeORM, Swagger, etc.

## Convenciones de Nomenclatura

Para mantener la consistencia en todo el proyecto, se seguirán estas convenciones:

- **Archivos**: kebab-case (ej. `jwt-auth.guard.ts`)
- **Clases**: PascalCase (ej. `JwtAuthGuard`)
- **Métodos y propiedades**: camelCase (ej. `validateRequest()`)
- **Interfaces**: PascalCase con prefijo 'I' (ej. `IJwtPayload`)
- **Enums**: PascalCase (ej. `UserRole`)
- **Constantes**: SNAKE_CASE_MAÚSCULAS (ej. `API_VERSION`)

## Proceso de Migración

1. **Fase 1**: Consolidar decoradores, guards y filtros
2. **Fase 2**: Reorganizar módulos y controladores
3. **Fase 3**: Refactorizar importaciones
4. **Fase 4**: Pruebas y verificación
5. **Fase 5**: Documentación y limpieza final

## Consideraciones Adicionales

- Mantener los tests funcionando durante la migración
- Realizar cambios incrementales con pruebas en cada paso
- Documentar los cambios realizados para facilitar la transición del equipo
- Actualizar la documentación de Swagger según sea necesario 