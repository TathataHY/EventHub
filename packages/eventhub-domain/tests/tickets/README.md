# Tests del Módulo de Tickets

Este directorio contiene pruebas unitarias para el módulo de tickets de la capa de dominio.

## Estructura

```
tickets/
├── Ticket.test.ts           # Tests para la entidad Ticket
├── TicketType.test.ts       # Tests para el value object TicketType
└── TicketStatus.test.ts     # Tests para el value object TicketStatus (pendiente)
```

## Pruebas implementadas

### Entidad Ticket

- Creación de tickets
- Validación de datos
- Actualización de tickets
- Compra de tickets
- Cancelación de compras
- Activación/desactivación de tickets

### Value Object TicketType

- Creación para distintos tipos (GENERAL, VIP, etc.)
- Comparación entre tipos
- Conversión a string

## Ejecución

Para ejecutar estas pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas del módulo de tickets
npm test -- --testPathPattern=tests/tickets
```

## Consideraciones

- Los tests utilizan mocks para dependencias como Event y User
- Se comprueban todas las reglas de negocio y validaciones
- Cada test comprueba un único comportamiento o validación
- Se verifica tanto el flujo normal como los casos de error 