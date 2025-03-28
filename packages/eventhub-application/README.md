# EventHub - Capa de Aplicación

Esta capa implementa los casos de uso de la aplicación, siguiendo patrones CQRS (Command Query Responsibility Segregation) y adaptadores de repositorio para comunicarse con la capa de dominio.

## Módulos

La capa de aplicación está organizada en módulos por funcionalidad:

- **Users**: Gestión de usuarios, roles y permisos
- **Events**: Creación y gestión de eventos
- **Tickets**: Venta y gestión de entradas
- **Payments**: Procesamiento de pagos
- **Reviews**: Valoraciones y comentarios
- **Notifications**: Sistema de notificaciones
- **Statistics**: Métricas y estadísticas

## Estabilización del Proyecto

Hemos realizado importantes cambios para estabilizar la capa de aplicación y resolver problemas de compatibilidad con el dominio:

### 1. Modernización de Interfaces

- Actualización de la interfaz `Command<T>` para soportar parámetros de entrada
- Creación de interfaces específicas `CommandWithParams`, `CommandWithoutParams`
- Actualización de la interfaz `Query<R>` y creación de variantes tipadas `QueryWithOneParam`, `QueryWithMultiParams`

### 2. Adaptadores de Repositorio

Los adaptadores de repositorio (como `UserRepositoryAdapter`) implementan las siguientes mejoras:

- Manejo seguro de tipos entre dominio y aplicación con conversión explícita
- Método de actualización por ID que gestiona inmutabilidad de entidades
- Implementación de métodos alternativos para funcionalidades no disponibles en el repositorio
- Manejo de tipos genéricos para búsquedas y filtros

### 3. Mappers

Los mappers (como `UserMapper`) ahora implementan:

- Método `toDTO` para convertir entidades a DTOs
- Método `toDomainProps` que prepara propiedades para crear entidades sin instanciarlas directamente
- Método `toUpdateProps` para actualización parcial de entidades

### 4. Excepciones Personalizadas

- Implementación de jerarquía de excepciones (`ApplicationException`)
- Excepciones específicas para casos comunes (`NotFoundException`, `UserAlreadyExistsException`)

## Métodos de Compilación

Hay dos formas de compilar la capa de aplicación:

1. **Compilación estándar**:
   ```
   npm run build
   ```
   - Aplica todas las verificaciones de tipo
   - Fallará si hay errores de tipo

2. **Compilación segura**:
   ```
   npm run build:safe
   ```
   - Compila el código ignorando errores de tipo
   - Genera archivos en `dist-safe` con `// @ts-nocheck` para ignorar errores
   - Útil durante el desarrollo mientras se corrigen errores

## Recomendaciones para el Desarrollo

1. **Seguir patrones establecidos**:
   - Utilizar Commands para operaciones de escritura/actualización
   - Utilizar Queries para operaciones de lectura
   - Implementar Mappers para conversión entre dominio y aplicación

2. **Manejo de errores**:
   - Lanzar excepciones específicas para cada caso de error
   - Capturar y transformar excepciones del dominio a excepciones de aplicación

3. **Pruebas**:
   - Implementar pruebas unitarias para Commands y Queries
   - Usar mocks para los repositorios

## Mantenimiento Continuo

A medida que se desarrolla el proyecto, se recomienda:

1. Corregir errores de tipo progresivamente
2. Revisar y actualizar las interfaces públicas de los módulos
3. Documentar cambios en la API
4. Mantener actualizados los DTOs según cambien las entidades del dominio
