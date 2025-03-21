# Módulo de Reviews

## Fusión de Comentarios y Calificaciones

Este módulo unifica la funcionalidad de los antiguos módulos de `Comentarios` y `Calificaciones` en un concepto único llamado `Reviews`. Esta fusión sigue los principios de Domain-Driven Design, donde identificamos que conceptualmente una reseña es una evaluación que puede incluir tanto un componente numérico (calificación) como textual (comentario).

### Beneficios de la fusión

1. **Coherencia conceptual**: Una reseña o review es un concepto más completo que incluye naturalmente tanto la calificación como el comentario
2. **Simplificación del dominio**: Reduce la complejidad al manejar un solo agregado en lugar de dos separados
3. **Operaciones atómicas**: Permite crear/modificar en una sola operación tanto la calificación como el comentario
4. **Consultas más eficientes**: Las estadísticas y listados no requieren unir datos de diferentes repositorios

## Estructura del módulo

### Commands

| Command | Descripción | Reemplaza a |
|---------|-------------|-------------|
| CreateReviewCommand | Crea una nueva reseña para un evento | CreateCommentUseCase y CreateRatingUseCase |
| UpdateReviewCommand | Actualiza una reseña existente | UpdateCommentUseCase y UpdateRatingUseCase |
| DeleteReviewCommand | Elimina lógicamente una reseña | DeleteCommentUseCase y DeleteRatingUseCase |
| VerifyReviewCommand | Marca una reseña como verificada por un moderador | N/A (Nueva funcionalidad) |

### Queries

| Query | Descripción | Reemplaza a |
|-------|-------------|-------------|
| GetReviewsByEventQuery | Obtiene todas las reseñas de un evento | GetEventCommentsUseCase y GetEventRatingsUseCase |
| GetReviewsByUserQuery | Obtiene todas las reseñas de un usuario | GetCommentsByUserUseCase y GetUserRatingUseCase |
| GetEventReviewStatsQuery | Obtiene estadísticas de las reseñas de un evento | GetEventRatingStatsUseCase |
| FindRecentVerifiedReviewsQuery | Encuentra reseñas verificadas recientes para testimonios | N/A (Nueva funcionalidad) |
| FindPendingModerationReviewsQuery | Encuentra reseñas pendientes de moderación | N/A (Nueva funcionalidad) |
| GetReviewsWithFiltersQuery | Busca reseñas con filtros avanzados | N/A (Nueva funcionalidad) |

## Guía de migración

Para completar la migración desde los módulos antiguos al nuevo sistema unificado:

1. Identificar todos los lugares donde se usan los casos de uso antiguos de comentarios y calificaciones
2. Reemplazar cada uno por su equivalente en el módulo de Reviews:
   - `CreateCommentUseCase` → `CreateReviewCommand` (añadiendo score = 0 si no aplica)
   - `UpdateCommentUseCase` → `UpdateReviewCommand` (manteniendo score existente)
   - `DeleteCommentUseCase` → `DeleteReviewCommand`
   - `GetEventCommentsUseCase` → `GetReviewsByEventQuery` (filtrando por contenido != null)
   - `CreateRatingUseCase` → `CreateReviewCommand` (con contenido opcional)
   - `UpdateRatingUseCase` → `UpdateReviewCommand` (actualizando solo score)
   - `DeleteRatingUseCase` → `DeleteReviewCommand`
   - `GetEventRatingsUseCase` → `GetReviewsByEventQuery` (filtrando por score > 0)
   - `GetEventRatingStatsUseCase` → `GetEventReviewStatsQuery`
3. Verificar que la nueva implementación cumple con todos los requisitos funcionales
4. Eliminar los módulos antiguos de comentarios y calificaciones

## Modelo de dominio

El dominio de Reviews incluye:

- **Review**: Entidad principal que combina calificación y comentario
- **ReviewStatus**: Valores posibles (activo, inactivo, verificado)
- **ReviewRepository**: Interfaz para persistencia de reseñas

## Migración de datos

Para sistemas en producción, será necesario migrar los datos existentes:

1. Crear nuevas reseñas a partir de cada calificación existente
2. Actualizar esas reseñas para añadir el contenido de los comentarios correspondientes (si existen)
3. Mantener una tabla de mapeo de IDs antiguos a nuevos durante la transición 