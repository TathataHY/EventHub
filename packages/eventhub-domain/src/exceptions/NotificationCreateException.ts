/**
 * Excepción lanzada cuando ocurre un error al crear una notificación
 */
export class NotificationCreateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotificationCreateException';

    // Necesario para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, NotificationCreateException.prototype);
  }
} 