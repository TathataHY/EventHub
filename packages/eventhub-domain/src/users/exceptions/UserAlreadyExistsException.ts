import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción que se lanza cuando se intenta crear un usuario con un email que ya existe
 * Esta es una regla invariante del dominio: un email solo puede estar asociado a un usuario
 */
export class UserAlreadyExistsException extends DomainException {
  /**
   * Constructor de la excepción
   * @param email Email que ya está en uso
   */
  constructor(email: string) {
    super(`El usuario con email ${email} ya existe`, 'USER_ALREADY_EXISTS');
    this.name = 'UserAlreadyExistsException';
  }
} 