/**
 * Módulo de Reseñas
 * 
 * Este módulo maneja todas las entidades y lógica relacionada con las reseñas
 * de eventos en la plataforma, permitiendo a los usuarios compartir sus opiniones
 * y calificaciones sobre los eventos a los que han asistido.
 * 
 * @module reviews
 */

// Entidades
export * from './entities/Review';

// Excepciones
export * from './exceptions/ReviewCreateException';
export * from './exceptions/ReviewUpdateException';

// Repositorios
export * from './repositories/ReviewRepository';

// Value Objects
// Actualmente no hay value objects específicos para reseñas 