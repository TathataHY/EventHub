import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de comentarios
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class CommentCreateException extends DomainException {
  /**
   * Constructor de CommentCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'COMMENT_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'COMMENT_CREATE_ERROR') {
    super(message, code);
    this.name = 'CommentCreateException';
  }
} 