import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de calificaciones
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class RatingCreateException extends DomainException {
  /**
   * Constructor de RatingCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'RATING_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'RATING_CREATE_ERROR') {
    super(message, code);
    this.name = 'RatingCreateException';
  }
} 