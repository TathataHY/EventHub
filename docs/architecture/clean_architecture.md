# Arquitectura Limpia en EventHub

## Introducción

EventHub sigue los principios de Arquitectura Limpia (Clean Architecture) para crear un sistema mantenible, escalable y testeable. La arquitectura está organizada en capas independientes, cada una con un propósito específico y reglas claras de dependencia.

## Estructura de Capas

### 1. Capa de Dominio (`eventhub-domain`)

Esta capa contiene las reglas de negocio principales y es independiente de cualquier framework o tecnología.

- **Entidades**: Objetos de dominio con lógica de negocio específica. Implementan todas las reglas de negocio invariantes y validaciones. Cada entidad encapsula su estado y comportamiento.
- **Value Objects**: Objetos inmutables que representan conceptos del dominio sin identidad propia. Son utilizados para encapsular atributos con reglas específicas.
- **Interfaces de Repositorios**: Definen contratos para el acceso a datos sin especificar implementaciones.
- **Excepciones de Dominio**: Excepciones específicas para cada situación de error en el dominio.

**Estado actual**: Se han implementado las principales entidades y value objects:

- **Entidades**: User, Event, Ticket, Payment, Notification, NotificationPreference, Review, Group, GroupMember, Category, Location, MediaFile, EventAttendee.
- **Value Objects**: Money, TicketStatus, TicketType, EventStatus, EventTags, EventLocation, Email, Role, Address, Coordinates, PaymentStatus, Currency, PaymentMethod, FileType.
- **Cobertura de pruebas**: Se han desarrollado tests unitarios para los elementos críticos (Ticket, Money, EventStatus, EventTags, EventLocation, etc.)
- **Principios DDD**: Todas las implementaciones siguen los principios de Domain-Driven Design, con encapsulamiento, validaciones robustas e inmutabilidad donde corresponde.

### 2. Capa de Aplicación (`eventhub-application`)

Esta capa coordina las actividades de alto nivel y orquesta el flujo de trabajo entre capas.

- **DTOs**: Objetos de transferencia de datos.
- **Casos de Uso**: Implementan lógica de aplicación específica.
- **Servicios de Aplicación**: Coordinan múltiples casos de uso.

**Estado actual**: Se han implementado casos de uso para la gestión de usuarios, eventos, tickets, notificaciones, pagos, comentarios, valoraciones, grupos y categorías. Se están utilizando DTOs para la transferencia de datos entre capas, y se han comenzado a implementar mappers para la conversión entre entidades y DTOs.

### 3. Capa de Infraestructura (`eventhub-infrastructure`)

Esta capa contiene implementaciones específicas de tecnologías y frameworks.

- **Repositorios**: Implementaciones concretas de las interfaces definidas en el dominio.
- **Entidades ORM**: Mapean las entidades de dominio a la base de datos.
- **Adaptadores externos**: Integración con servicios externos.

**Estado actual**: Se han implementado repositorios TypeORM para la mayoría de las entidades. Se están desarrollando adaptadores para servicios externos y se están configurando módulos para la integración con el sistema.

### 4. Capa de Presentación (`eventhub-api`, `eventhub-mobile`)

Esta capa se encarga de presentar la información al usuario y capturar sus entradas.

- **Controladores**: Manejan las solicitudes HTTP.
- **Vistas**: Muestran información al usuario.
- **Presentadores**: Adaptan los datos para la visualización.

**Estado actual**: Se han implementado controladores para todas las funcionalidades principales, incluyendo autenticación, eventos, usuarios, notificaciones, pagos, tickets, comentarios, valoraciones, búsqueda, categorías, análisis y webhooks. Algunos controladores necesitan ser refactorizados para usar completamente los mappers y casos de uso de la arquitectura limpia.

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
  ├── eventhub-domain/        # Entidades, value objects e interfaces de repositorios
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
| - Vistas       |    | - DTOs           |    | - Servicios Ext.    |    | - Value Objects |
+----------------+    +------------------+    +---------------------+    +-----------------+
```

## Ejemplos de Código

### Entidad de Dominio

```typescript
// eventhub-domain/src/events/entities/Event.ts
export class Event extends Entity<EventProps> {
  private constructor(props: EventProps) {
    super(props);
    this.validate();
  }

  static create(props: CreateEventProps): Result<Event> {
    // Lógica de creación y validación
    return Result.ok(new Event({
      ...props,
      status: EventStatus.draft(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  update(props: UpdateEventProps): Result<Event> {
    // Lógica de actualización con validaciones
    if (this.isCompleted()) {
      return Result.fail("No se puede actualizar un evento finalizado");
    }
    
    return Result.ok(new Event({
      ...this.props,
      ...props,
      updatedAt: new Date()
    }));
  }

  // Métodos de dominio con lógica de negocio
  publish(): Result<Event> {
    if (!this.canBePublished()) {
      return Result.fail("El evento no cumple los requisitos para ser publicado");
    }
    
    return Result.ok(new Event({
      ...this.props,
      status: EventStatus.published(),
      updatedAt: new Date()
    }));
  }

  private validate(): void {
    // Validaciones de invariantes
  }
}
```

### Value Object

```typescript
// eventhub-domain/src/core/value-objects/Money.ts
export class Money implements ValueObject<MoneyProps> {
  private readonly amount: number;
  private readonly currency: string;

  private constructor(props: MoneyProps) {
    if (props.amount < 0) {
      throw new Error("El monto no puede ser negativo");
    }
    
    this.amount = props.amount;
    this.currency = props.currency || "USD";
  }

  static create(amount: number, currency: string = "USD"): Money {
    return new Money({ amount, currency });
  }

  value(): MoneyProps {
    return {
      amount: this.amount,
      currency: this.currency
    };
  }

  equals(vo?: ValueObject<MoneyProps>): boolean {
    if (!vo) return false;
    const valueObject = vo.value();
    return this.amount === valueObject.amount && this.currency === valueObject.currency;
  }

  add(money: Money): Money {
    if (this.currency !== money.value().currency) {
      throw new Error("No se pueden sumar montos con diferentes monedas");
    }
    
    return Money.create(
      this.amount + money.value().amount,
      this.currency
    );
  }

  multiply(multiplier: number): Money {
    return Money.create(
      this.amount * multiplier,
      this.currency
    );
  }

  format(): string {
    return new Intl.NumberFormat("default", {
      style: "currency",
      currency: this.currency
    }).format(this.amount);
  }
}
```

### Caso de Uso

```typescript
// eventhub-application/src/use-cases/event/CreateEventUseCase.ts
export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(dto: CreateEventDto): Promise<EventDto> {
    // Lógica de aplicación
    const eventOrError = Event.create({
      title: dto.title,
      description: dto.description,
      // ... otras propiedades
    });

    if (eventOrError.isFailure) {
      throw new ApplicationError("Error al crear evento", eventOrError.error);
    }

    const event = eventOrError.getValue();
    await this.eventRepository.save(event);

    return EventMapper.toDTO(event);
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
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    return EventMapper.toDomain(entity);
  }

  async save(event: Event): Promise<void> {
    const entity = EventMapper.toPersistence(event);
    await this.repo.save(entity);
  }
}
```

### Controlador

```typescript
// eventhub-api/src/controllers/event.controller.ts
@Controller('events')
export class EventController {
  constructor(private readonly createEventUseCase: CreateEventUseCase) {}

  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    try {
      return await this.createEventUseCase.execute(dto);
    } catch (error) {
      // Manejo de errores
    }
  }
}
```

## Mejores Prácticas

1. **Mantener el dominio puro**: No introducir dependencias de frameworks o librerías externas.
2. **Seguir el principio de inversión de dependencias**: Usar interfaces y patrones de inyección.
3. **Validar en múltiples niveles**: Validar en las entidades de dominio y en los DTOs.
4. **Mantener la cohesión**: Agrupar elementos relacionados y separar los no relacionados.
5. **Aplicar principios SOLID**: En todos los niveles de la arquitectura.
6. **Inmutabilidad**: Preferir objetos inmutables, especialmente en value objects.
7. **Encapsulamiento**: Proteger el estado interno de las entidades y value objects.
8. **Tell, Don't Ask**: Preferir métodos que ejecuten comportamientos en lugar de exponer estado.

## Estado Actual y Próximos Pasos

### Completado
- Implementación de entidades de dominio principales
- Desarrollo de value objects con enfoque DDD
- Pruebas unitarias para componentes críticos del dominio
- Diseño de interfaces de repositorio

### En Progreso
- Implementación de casos de uso en la capa de aplicación
- Desarrollo de repositorios en la capa de infraestructura
- Refactorización de controladores para usar la arquitectura limpia
- Mejora de la validación en DTOs

### Pendiente
- Completar pruebas unitarias para todas las entidades y casos de uso
- Implementar caché para operaciones frecuentes
- Configurar transacciones en casos de uso complejos
- Mejorar la documentación de la API con Swagger
- Implementar métricas y monitoreo

## Recursos Adicionales

- [Clean Architecture de Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design de Eric Evans](https://domainlanguage.com/ddd/)
- [Patrones de Diseño de Dominio](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice) 