import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de comentarios
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class CommentUpdateException extends DomainException {
  /**
   * Constructor de CommentUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'COMMENT_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'COMMENT_UPDATE_ERROR') {
    super(message, code);
    this.name = 'CommentUpdateException';
  }
} 