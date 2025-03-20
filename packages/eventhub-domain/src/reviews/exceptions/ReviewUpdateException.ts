import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de reseñas
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class ReviewUpdateException extends DomainException {
  /**
   * Constructor de ReviewUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'REVIEW_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'REVIEW_UPDATE_ERROR') {
    super(message, code);
    this.name = 'ReviewUpdateException';
  }
} 