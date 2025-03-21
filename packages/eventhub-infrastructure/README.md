# EventHub Infrastructure

Este proyecto contiene la capa de infraestructura para la aplicación EventHub.

## Estructura del Proyecto

La estructura del proyecto está organizada siguiendo principios de arquitectura limpia:

```
src/
├── adapters/            # Adaptadores para servicios externos
├── clients/             # Clientes para servicios externos (APIs, etc.)
├── entities/            # Entidades de base de datos (TypeORM)
├── mappers/             # Mapeadores entre entidades y objetos de dominio
├── modules/             # Módulos NestJS para cada funcionalidad
├── repositories/        # Implementación de repositorios
├── services/            # Servicios de infraestructura
└── index.ts             # Punto de entrada y exportación de módulos
```

## Responsabilidades

La capa de infraestructura tiene las siguientes responsabilidades:

1. Implementar las interfaces definidas en la capa de dominio
2. Proporcionar acceso a servicios externos (bases de datos, APIs, etc.)
3. Definir entidades y mapeadores para persistencia
4. Implementar los repositorios

## Módulos Principales

Los módulos principales de infraestructura incluyen:

- `UserModule` - Gestión de usuarios
- `EventModule` - Gestión de eventos
- `AuthModule` - Autenticación y autorización
- `TicketModule` - Gestión de tickets
- `PaymentModule` - Procesamiento de pagos
- `NotificationModule` - Gestión de notificaciones
- etc.

## Convenciones

- Nombres de archivos: kebab-case (ej. `user-repository.ts`)
- Nombres de clases: PascalCase (ej. `UserRepository`)
- Los repositorios deben implementar las interfaces definidas en la capa de dominio
- Los mappers deben convertir entre entidades de infraestructura y objetos de dominio
- Evitar dependencias circulares entre módulos

## Nota Importante

Para mantener una arquitectura limpia, se debe evitar que los controladores estén en esta capa. Los controladores deben estar en la capa de API. 