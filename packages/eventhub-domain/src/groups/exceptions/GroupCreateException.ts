import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de grupos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class GroupCreateException extends DomainException {
  /**
   * Constructor de GroupCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'GROUP_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'GROUP_CREATE_ERROR') {
    super(message, code);
    this.name = 'GroupCreateException';
  }
} 