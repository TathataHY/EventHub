/**
 * Excepción lanzada cuando ocurre un error al actualizar un usuario
 */
export class UserUpdateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserUpdateException';

    // Necesario para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, UserUpdateException.prototype);
  }
} 