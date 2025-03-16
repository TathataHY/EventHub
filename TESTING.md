# Guía de Testing para EventHub

Esta guía está diseñada para ayudar al equipo de QA a probar la aplicación EventHub, que ha sido migrada a Clean Architecture.

## Estructura de Pruebas

Debido a la arquitectura limpia implementada, las pruebas se deben organizar siguiendo la misma estructura de capas:

### 1. Pruebas de Dominio

Estas pruebas verifican las reglas de negocio y la lógica de las entidades.

**Ubicación recomendada:**
```
packages/eventhub-domain/src/entities/__tests__/
packages/eventhub-domain/src/value-objects/__tests__/
```

**Qué probar:**
- Creación de entidades con datos válidos e inválidos
- Validaciones de reglas de negocio
- Métodos de entidades (addAttendee, cancelEvent, etc.)
- Value objects y sus validaciones

**Ejemplo:**
```typescript
describe('Event Entity', () => {
  test('should create a valid event', () => {
    // Arrange
    const eventData = { /* datos válidos */ };
    
    // Act
    const event = new Event(eventData);
    
    // Assert
    expect(event).toBeInstanceOf(Event);
  });
  
  test('should throw error when creating event with invalid dates', () => {
    // Arrange
    const eventData = { 
      startDate: new Date('2023-12-31'),
      endDate: new Date('2023-12-30')
    };
    
    // Act & Assert
    expect(() => new Event(eventData)).toThrow(EventCreateException);
  });
});
```

### 2. Pruebas de Casos de Uso

Estas pruebas verifican la lógica de aplicación usando repositorios simulados.

**Ubicación recomendada:**
```
packages/eventhub-application/src/use-cases/__tests__/
```

**Qué probar:**
- Ejecución correcta del caso de uso con datos válidos
- Manejo de errores y excepciones
- Interacción con repositorios (usando mocks/spies)
- Flujos alternativos y condiciones de borde

**Ejemplo:**
```typescript
describe('CreateEventUseCase', () => {
  let useCase: CreateEventUseCase;
  let mockEventRepository: jest.Mocked<EventRepository>;
  
  beforeEach(() => {
    mockEventRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      // Otros métodos...
    } as any;
    
    useCase = new CreateEventUseCase(mockEventRepository);
  });
  
  test('should create event successfully', async () => {
    // Arrange
    const dto = { /* datos válidos */ };
    const userId = '123';
    mockEventRepository.save.mockResolvedValue(new Event({ /* datos */ }));
    
    // Act
    const result = await useCase.execute(dto, userId);
    
    // Assert
    expect(mockEventRepository.save).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.organizerId).toBe(userId);
  });
});
```

### 3. Pruebas de Repositorios

Estas pruebas verifican las implementaciones concretas de repositorios.

**Ubicación recomendada:**
```
packages/eventhub-infrastructure/src/repositories/__tests__/
```

**Qué probar:**
- Operaciones CRUD básicas
- Consultas con filtros
- Mapeo correcto entre entidades ORM y dominio
- Manejo de errores de base de datos

**Enfoque recomendado:**
- Usar una base de datos en memoria (como SQLite en memoria)
- Configurar y limpiar la base de datos entre pruebas

### 4. Pruebas de API (Controladores)

Estas pruebas verifican los endpoints HTTP y su integración con los casos de uso.

**Ubicación recomendada:**
```
packages/eventhub-api/src/controllers/__tests__/
```

**Qué probar:**
- Respuestas HTTP correctas para datos válidos
- Manejo de errores y códigos de estado apropiados
- Validación de datos de entrada
- Autenticación y autorización

**Ejemplo:**
```typescript
describe('EventController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  
  beforeAll(async () => {
    // Configurar la aplicación de prueba...
    // Obtener token de autenticación...
  });
  
  test('/events (POST) should create event', () => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ /* datos de evento */ })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
      });
  });
});
```

### 5. Pruebas End-to-End

Estas pruebas verifican flujos completos de la aplicación.

**Ubicación recomendada:**
```
packages/eventhub-api/test/e2e/
```

**Qué probar:**
- Escenarios de usuario completos (registro, creación de evento, etc.)
- Integración entre diferentes módulos
- Flujos de datos a través de toda la aplicación

## Repositorios In-Memory

La arquitectura implementada incluye repositorios en memoria que facilitan las pruebas:

```typescript
// Ejemplo de uso en pruebas
describe('Mis pruebas', () => {
  let eventRepository: InMemoryEventRepository;
  
  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    // Puedes precargar datos si es necesario
    eventRepository.save(new Event({ /* datos */ }));
  });
  
  test('mi prueba', async () => {
    // Usar el repositorio en memoria para pruebas
  });
  
  afterEach(() => {
    // Limpiar el repositorio
    eventRepository.clear();
  });
});
```

## Mocks vs Repositorios In-Memory

- **Mocks (jest.fn())**: Úsalos para probar casos de uso de forma aislada
- **Repositorios In-Memory**: Úsalos para pruebas de integración entre capas

## Herramientas Recomendadas

- **Jest**: Framework de pruebas principal
- **Supertest**: Para pruebas HTTP de los controladores
- **ts-mockito** o **jest.mock()**: Para crear mocks y stubs

## Convenciones de Nombres

- Los archivos de prueba deben terminar en `.test.ts` o `.spec.ts`
- Agrupar pruebas en bloques `describe` por funcionalidad
- Nombrar los tests con formato "should [expected behavior] when [condition]"

## Pipeline de CI/CD

Se recomienda configurar un pipeline que ejecute estas pruebas en orden:
1. Pruebas de dominio (rápidas, sin dependencias)
2. Pruebas de casos de uso (con mocks)
3. Pruebas de repositorios (con BD en memoria)
4. Pruebas de API
5. Pruebas end-to-end (más lentas)

## Cobertura de Código

Se recomienda mantener una cobertura mínima del:
- 90% para la capa de dominio
- 80% para casos de uso
- 70% para repositorios y controladores

Ejecutar con:
```bash
npm test -- --coverage
```

## Problemas Comunes

- **Datos de prueba inconsistentes**: Usar factories o builders para crear datos de prueba consistentes
- **Pruebas frágiles**: Evitar dependencias de estado entre pruebas
- **Pruebas lentas**: Minimizar uso de BD reales, preferir repositorios en memoria

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing NestJS Applications](https://docs.nestjs.com/fundamentals/testing)
- [Clean Architecture Testing Strategies](https://blog.cleancoder.com/uncle-bob/2011/11/22/Clean-Architecture.html) 