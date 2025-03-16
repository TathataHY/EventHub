# Guía de Módulos NestJS para EventHub

Esta guía explica la estructura y funcionamiento de los módulos en la aplicación EventHub, que sigue los principios de Clean Architecture.

## Visión General

Los módulos de NestJS nos permiten organizar la aplicación en componentes cohesivos que implementan la inyección de dependencias. En nuestra arquitectura limpia, los módulos tienen responsabilidades específicas:

1. **DomainModule**: Proporciona las implementaciones de repositorios
2. **ApplicationModule**: Registra los casos de uso
3. **Módulos de Funcionalidad**: EventModule, UserModule, NotificationModule, etc.

## DomainModule

Ubicación: `packages/eventhub-api/src/infrastructure/modules/domain.module.ts`

Este módulo es el encargado de:
- Registrar las entidades para TypeORM
- Proporcionar las implementaciones concretas de repositorios
- Ofrecer implementaciones alternativas para pruebas (InMemory)

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity, 
      UserEntity, 
      NotificationEntity
    ])
  ],
  providers: [
    // Implementaciones reales
    {
      provide: 'EventRepository',
      useClass: TypeOrmEventRepository,
    },
    // Implementaciones para pruebas
    {
      provide: 'InMemoryEventRepository',
      useClass: InMemoryEventRepository,
    },
  ],
  exports: [
    'EventRepository',
    'InMemoryEventRepository',
    TypeOrmModule
  ],
})
export class DomainModule {}
```

## ApplicationModule

Ubicación: `packages/eventhub-api/src/infrastructure/modules/application.module.ts`

Este módulo es responsable de:
- Importar el DomainModule para acceder a los repositorios
- Registrar y configurar los casos de uso
- Inyectar las dependencias adecuadas a cada caso de uso

```typescript
@Module({
  imports: [DomainModule],
  providers: [
    // Casos de uso
    {
      provide: CreateEventUseCase,
      useFactory: (eventRepository) => new CreateEventUseCase(eventRepository),
      inject: ['EventRepository'],
    },
    // Más casos de uso...
  ],
  exports: [
    CreateEventUseCase,
    // Más exportaciones...
  ],
})
export class ApplicationModule {}
```

## Módulos de Funcionalidad

### EventModule

Ubicación: `packages/eventhub-api/src/infrastructure/modules/event.module.ts`

Este módulo se encarga de:
- Importar los módulos necesarios (DomainModule, ApplicationModule)
- Registrar los controladores de eventos
- Exportar servicios o casos de uso específicos

```typescript
@Module({
  imports: [
    DomainModule,
    ApplicationModule
  ],
  controllers: [EventController],
  exports: [
    // Casos de uso exportados para otros módulos
  ]
})
export class EventModule {}
```

### UserModule

Similar al EventModule pero para la gestión de usuarios.

### NotificationModule

Similar al EventModule pero para la gestión de notificaciones.

## Módulo Raíz (AppModule)

Ubicación: `packages/eventhub-api/src/app.module.ts`

Este es el módulo principal que:
- Importa y configura todos los módulos de la aplicación
- Configura servicios globales (Base de datos, JWT, etc.)
- Establece middleware global

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      // Configuración de base de datos
    }),
    JwtModule.registerAsync({
      // Configuración de JWT
    }),
    
    // Módulos de la aplicación
    DomainModule,
    ApplicationModule,
    EventModule,
    UserModule,
    NotificationModule,
    AuthModule,
    WebsocketModule,
  ],
})
export class AppModule {}
```

## Flujo de Dependencias

El flujo de dependencias sigue la regla de dependencia de Clean Architecture:

```
AppModule
    ↓
EventModule/UserModule/etc.
    ↓
ApplicationModule
    ↓
DomainModule
```

## Inyección de Repositorios a Casos de Uso

La inyección de dependencias ocurre así:

1. `DomainModule` registra el repositorio con un token (`'EventRepository'`)
2. `ApplicationModule` inyecta ese repositorio a los casos de uso
3. `EventModule` usa los casos de uso ya configurados

## Símbolos de Inyección

Usamos strings como tokens para identificar servicios:
- `'EventRepository'`
- `'UserRepository'`
- `'NotificationRepository'`

## Variantes para Testing

Para facilitar las pruebas, proporcionamos implementaciones alternativas:
- `'InMemoryEventRepository'`
- `'InMemoryUserRepository'`
- `'InMemoryNotificationRepository'`

## Casos de Uso de Testing

También registramos casos de uso configurados con repositorios en memoria:
- `'InMemoryCreateEventUseCase'`
- `'InMemoryGetEventByIdUseCase'`

## Consejos para Extender

### Añadir un Nuevo Repositorio

1. Definir la interfaz en `eventhub-domain`
2. Implementar en `eventhub-infrastructure`
3. Registrar en `DomainModule`:

```typescript
{
  provide: 'NewEntityRepository',
  useClass: TypeOrmNewEntityRepository,
},
```

### Añadir un Nuevo Caso de Uso

1. Implementar el caso de uso en `eventhub-application`
2. Registrar en `ApplicationModule`:

```typescript
{
  provide: NewEntityUseCase,
  useFactory: (newEntityRepository) => new NewEntityUseCase(newEntityRepository),
  inject: ['NewEntityRepository'],
},
```

### Añadir un Nuevo Módulo de Funcionalidad

1. Crear un nuevo módulo:

```typescript
@Module({
  imports: [
    DomainModule,
    ApplicationModule
  ],
  controllers: [NewFeatureController],
  providers: [
    // Servicios específicos
  ],
  exports: [
    // Exportaciones
  ]
})
export class NewFeatureModule {}
```

2. Importar en `AppModule` 