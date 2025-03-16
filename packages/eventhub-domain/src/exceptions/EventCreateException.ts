/**
 * Excepción lanzada cuando ocurre un error al crear un evento
 */
export class EventCreateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventCreateException';

    // Necesario para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, EventCreateException.prototype);
  }
} 