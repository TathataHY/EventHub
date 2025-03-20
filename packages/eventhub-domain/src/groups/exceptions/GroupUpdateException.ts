import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de grupos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class GroupUpdateException extends DomainException {
  /**
   * Constructor de GroupUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'GROUP_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'GROUP_UPDATE_ERROR') {
    super(message, code);
    this.name = 'GroupUpdateException';
  }
} 