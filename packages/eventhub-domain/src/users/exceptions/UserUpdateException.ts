import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de usuarios
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class UserUpdateException extends DomainException {
  /**
   * Constructor de UserUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'USER_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'USER_UPDATE_ERROR') {
    super(message, code);
    this.name = 'UserUpdateException';
  }
} 