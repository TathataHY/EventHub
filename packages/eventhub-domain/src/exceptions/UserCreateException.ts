/**
 * Excepción lanzada cuando ocurre un error al crear un usuario
 */
export class UserCreateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserCreateException';

    // Necesario para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, UserCreateException.prototype);
  }
} 