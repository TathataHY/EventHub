/**
 * Excepción lanzada cuando ocurre un error al actualizar un evento
 */
export class EventUpdateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventUpdateException';

    // Necesario para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, EventUpdateException.prototype);
  }
} 