# EventHub Infrastructure

Este paquete contiene las implementaciones concretas de los repositorios, servicios externos y clientes para APIs.

## Estructura

- `repositories/`: Implementaciones concretas de los repositorios definidos en el dominio
- `entities/`: Entidades ORM/base de datos
- `clients/`: Clientes para APIs externas
- `services/`: Implementaciones de servicios externos

## Principios

Este paquete representa la capa de infraestructura en la Arquitectura Limpia. Depende de las capas de dominio y aplicación, y proporciona las implementaciones concretas de las interfaces definidas en estas capas. 