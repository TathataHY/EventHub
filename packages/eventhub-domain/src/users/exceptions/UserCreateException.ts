import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de usuarios
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class UserCreateException extends DomainException {
  /**
   * Constructor de UserCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'USER_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'USER_CREATE_ERROR') {
    super(message, code);
    this.name = 'UserCreateException';
  }
} 