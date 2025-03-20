# Changelog - EventHub Domain

## [Unreleased]

### Mejoras en la arquitectura del dominio

#### Reorganización y estructura
- Reorganización de la capa de dominio por características del negocio (DDD)
- Implementación de estructura modular coherente para todos los módulos
- Separación clara entre entidades, objetos de valor, repositorios y excepciones
- Módulos implementados: users, events, tickets, payments, groups, notifications, etc.

#### Documentación
- Documentación mejorada para todo el dominio con comentarios TSDoc
- README general con explicación de la arquitectura y patrones
- README específicos para módulos clave

#### Implementación de patrones
- Value Objects inmutables con validación y encapsulamiento
- Entidades con métodos factory y validaciones
- Repositorios como interfaces con métodos específicos
- Excepciones de dominio organizadas por módulo

#### Módulos específicos
- Separación del módulo de tickets de payments para mejor cohesión
- Implementación completa del módulo de tickets con todas sus reglas de negocio
- Implementación de media para gestión de archivos multimedia
- Mejora del módulo de eventos con validaciones robustas

#### Tests
- Estructura de tests unitarios separados por módulo
- Tests completos para entidades y objetos de valor
- Documentación de tests y patrones de prueba

### Correcciones
- Eliminación de código duplicado entre módulos
- Corrección de imports para usar core en lugar de shared
- Mejora de interfaces para evitar conflictos
- Refactorización de excepciones específicas

## [0.1.0] - 2023-03-20

### Características iniciales
- Estructura base del dominio
- Interfaces core (Entity, ValueObject, Repository)
- Excepciones base
- Módulos de usuarios y eventos 