import { bookmarkService } from '@modules/events/services/bookmark.service';
import { recommendationService } from '@modules/events/services/recommendation.service';

/**
 * Configura las dependencias entre servicios para evitar ciclos de dependencia
 */
export function setupDependencies(): void {
  // Registrar el callback de interacción de recommendationService en bookmarkService
  bookmarkService.registerInteractionCallback(
    (userId, eventId, category, interactionType, eventLocation) => {
      recommendationService.recordInteraction(
        userId,
        eventId,
        category,
        interactionType,
        eventLocation
      );
    }
  );
  
  // Aquí podríamos agregar más configuraciones de dependencias si fueran necesarias en el futuro
} 