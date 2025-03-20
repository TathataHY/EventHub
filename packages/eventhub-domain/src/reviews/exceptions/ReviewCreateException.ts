import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de reseñas
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class ReviewCreateException extends DomainException {
  /**
   * Constructor de ReviewCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'REVIEW_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'REVIEW_CREATE_ERROR') {
    super(message, code);
    this.name = 'ReviewCreateException';
  }
} 