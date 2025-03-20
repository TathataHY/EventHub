# Tests del Módulo de Reviews

Este directorio contiene pruebas unitarias para el módulo de reviews (reseñas) de la capa de dominio.

## Estructura

```
reviews/
├── Review.test.ts           # Tests para la entidad Review
└── README.md                # Documentación de los tests
```

## Pruebas implementadas

### Entidad Review

- Creación de reseñas
- Validación de datos (puntuación, contenido)
- Actualización de reseñas
- Verificación de reseñas
- Activación/desactivación de reseñas

## Ejecución

Para ejecutar estas pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas del módulo de reviews
npm test -- --testPathPattern=tests/reviews
```

## Consideraciones

- Los tests utilizan mocks para simular las dependencias externas
- Se comprueban todas las reglas de negocio implementadas en la entidad
- Se verifican los diferentes estados por los que puede pasar una reseña
- Se prueban tanto los casos exitosos como los casos de error 