# Arquitectura Limpia en EventHub

## Introducción

EventHub sigue los principios de Arquitectura Limpia (Clean Architecture) para crear un sistema mantenible, escalable y testeable. La arquitectura está organizada en capas independientes, cada una con un propósito específico y reglas claras de dependencia.

## Estructura de Capas

### 1. Capa de Dominio (`eventhub-domain`)

Esta capa contiene las reglas de negocio principales y es independiente de cualquier framework o tecnología.

- **Entidades**: Objetos de dominio con lógica de negocio.
- **Interfaces de Repositorios**: Definen cómo se accede a los datos sin especificar implementaciones.
- **Value Objects**: Objetos inmutables que representan conceptos del dominio.

### 2. Capa de Aplicación (`eventhub-application`)

Esta capa coordina las actividades de alto nivel y orquesta el flujo de trabajo entre capas.

- **DTOs**: Objetos de transferencia de datos.
- **Casos de Uso**: Implementan lógica de aplicación específica.
- **Servicios de Aplicación**: Coordinan múltiples casos de uso.

### 3. Capa de Infraestructura (`eventhub-infrastructure`)

Esta capa contiene implementaciones específicas de tecnologías y frameworks.

- **Repositorios**: Implementaciones concretas de las interfaces definidas en el dominio.
- **Entidades ORM**: Mapean las entidades de dominio a la base de datos.
- **Adaptadores externos**: Integración con servicios externos.

### 4. Capa de Presentación (`eventhub-api`, `eventhub-mobile`)

Esta capa se encarga de presentar la información al usuario y capturar sus entradas.

- **Controladores**: Manejan las solicitudes HTTP.
- **Vistas**: Muestran información al usuario.
- **Presentadores**: Adaptan los datos para la visualización.

## Reglas de Dependencia

Las dependencias solo pueden apuntar hacia adentro, nunca hacia afuera:

1. La capa de dominio no depende de ninguna otra capa.
2. La capa de aplicación solo depende de la capa de dominio.
3. La capa de infraestructura puede depender de la capa de dominio y aplicación.
4. La capa de presentación puede depender de todas las capas.

## Beneficios

- **Independencia de frameworks**: El código central no está atado a librerías o frameworks específicos.
- **Testabilidad**: Cada capa puede ser probada de forma aislada.
- **Independencia de la UI**: La interfaz de usuario puede cambiar sin afectar la lógica de negocio.
- **Independencia de la base de datos**: La lógica de negocio no está acoplada a la base de datos.
- **Independencia de agentes externos**: Las reglas de negocio no saben nada sobre el mundo exterior.

## Implementación en EventHub

### Estructura de Paquetes

```
packages/
  ├── eventhub-domain/        # Entidades e interfaces de repositorios
  ├── eventhub-application/   # Casos de uso y DTOs
  ├── eventhub-infrastructure/ # Implementaciones de repositorios y servicios
  ├── eventhub-api/           # API REST con NestJS
  ├── eventhub-mobile/        # Aplicación móvil con React Native
  └── eventhub-shared/        # Tipos y utilidades compartidas
```

### Diagrama de Flujo

```
+----------------+    +------------------+    +---------------------+    +-----------------+
|  Presentación  |    |    Aplicación    |    |   Infraestructura   |    |     Dominio     |
|                |<---|                  |<---|                     |<---|                 |
| - Controladores|    | - Casos de Uso   |    | - Repos (TypeORM)   |    | - Entidades     |
| - Vistas       |    | - DTOs           |    | - Servicios Ext.    |    | - Repos (int.)  |
+----------------+    +------------------+    +---------------------+    +-----------------+
```

## Ejemplos de Código

### Entidad de Dominio

```typescript
// eventhub-domain/src/entities/Event.ts
export class Event {
  private _id: string;
  private _title: string;
  // ...

  constructor(params: {...}) {
    // ...
    this.validate();
  }

  // Getters, métodos de negocio, validaciones...
}
```

### Caso de Uso

```typescript
// eventhub-application/src/use-cases/event/CreateEventUseCase.ts
export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(dto: CreateEventDto): Promise<EventDto> {
    // ...
  }
}
```

### Repositorio

```typescript
// eventhub-infrastructure/src/repositories/TypeOrmEventRepository.ts
@Injectable()
export class TypeOrmEventRepository implements EventRepository {
  constructor(@InjectRepository(EventEntity) private readonly repo: Repository<EventEntity>) {}

  async findById(id: string): Promise<Event | null> {
    // ...
  }
}
```

### Controlador

```typescript
// eventhub-api/src/presentation/controllers/event.controller.ts
@Controller('events')
export class EventController {
  constructor(private readonly createEventUseCase: CreateEventUseCase) {}

  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    return this.createEventUseCase.execute(dto);
  }
}
```

## Mejores Prácticas

1. **Mantener el dominio puro**: No introducir dependencias de frameworks o librerías externas.
2. **Seguir el principio de inversión de dependencias**: Usar interfaces y patrones de inyección.
3. **Validar en múltiples niveles**: Validar en las entidades de dominio y en los DTOs.
4. **Mantener la cohesión**: Agrupar elementos relacionados y separar los no relacionados.
5. **Aplicar principios SOLID**: En todos los niveles de la arquitectura.

## Migración desde la Arquitectura Anterior

Si estás trabajando en código existente, sigue estos pasos para migrar a la nueva arquitectura:

1. Identifica las entidades de dominio en el código actual.
2. Crea versiones limpias de estas entidades en la capa de dominio.
3. Define las interfaces de repositorio necesarias.
4. Implementa los casos de uso en la capa de aplicación.
5. Crea implementaciones concretas de los repositorios en la capa de infraestructura.
6. Adapta los controladores existentes para usar los nuevos casos de uso.
7. Actualiza las pruebas para reflejar la nueva estructura.

## Recursos Adicionales

- [Clean Architecture de Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Patrones de Diseño de Dominio](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice) 