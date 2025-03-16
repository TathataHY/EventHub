# Tareas Pendientes para la Migración a Arquitectura Limpia

## 1. Refactorización de Controladores

- Actualizar `EventController` para usar los mappers y casos de uso de la nueva arquitectura
- Actualizar `UserController` para usar los mappers y casos de uso de la nueva arquitectura
- Actualizar `NotificationController` para usar los mappers y casos de uso de la nueva arquitectura

## 2. Implementación de Validación

- Implementar validación a nivel de entidades de dominio
- Implementar validación a nivel de DTOs con class-validator
- Configurar pipes de validación global en NestJS

## 3. Pruebas

- Crear pruebas unitarias para todas las entidades de dominio
- Crear pruebas unitarias para los casos de uso
- Crear pruebas de integración para los repositorios
- Configurar entorno de pruebas con base de datos en memoria

## 4. Migración de Datos

- Crear scripts de migración para mover datos del esquema antiguo al nuevo
- Validar integridad de los datos migrados

## 5. Documentación

- Documentar cada módulo, caso de uso y repositorio
- Actualizar la documentación de la API con Swagger
- Crear diagramas de secuencia para los flujos principales
- Documentar el proceso de migración para futuros desarrolladores

## 6. Infraestructura

- Implementar repositorios TypeORM para todas las entidades restantes
- Configurar transacciones en los casos de uso que lo requieran
- Implementar caché para operaciones frecuentes

## 7. Seguridad

- Refactorizar la autenticación y autorización con la nueva arquitectura
- Implementar manejo de tokens con casos de uso
- Configurar guardias de NestJS para proteger rutas

## 8. Frontend

- Actualizar los servicios del frontend para interactuar con la nueva API
- Implementar DTOs en el frontend para validación de formularios
- Actualizar las pruebas del frontend

## 9. CI/CD

- Actualizar los pipelines de CI/CD para ejecutar pruebas de la nueva arquitectura
- Configurar entornos de staging con la nueva arquitectura

## 10. Monitoreo

- Configurar logs estructurados
- Implementar métricas para casos de uso críticos
- Configurar alertas para errores en la nueva arquitectura 