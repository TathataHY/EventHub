import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores relacionados con miembros de grupos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class GroupMemberException extends DomainException {
  /**
   * Constructor de GroupMemberException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'GROUP_MEMBER_ERROR')
   */
  constructor(message: string, code: string = 'GROUP_MEMBER_ERROR') {
    super(message, code);
    this.name = 'GroupMemberException';
  }
} 