/**
 * Módulo de eventos de la aplicación
 * 
 * Este módulo gestiona la funcionalidad relacionada con los eventos:
 * - Creación y edición de eventos
 * - Visualización de detalles de eventos
 * - Ubicación de eventos
 * - Comentarios de eventos
 */

// Exportaciones de componentes, pantallas y hooks
export * from './components';
export * from './screens';
export * from './hooks';

// Exportar los tipos desde el módulo de tipos (principal)
import * as EventTypes from './types';
export { EventTypes };

// Exportar los servicios, pero sin las interfaces duplicadas
import { 
  eventService, 
  bookmarkService,
  commentService,
  ratingService,
  recommendationService
} from './services';

export {
  eventService, 
  bookmarkService,
  commentService,
  ratingService,
  recommendationService
};
