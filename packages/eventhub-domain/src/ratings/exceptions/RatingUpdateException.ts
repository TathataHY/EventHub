import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de calificaciones
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class RatingUpdateException extends DomainException {
  /**
   * Constructor de RatingUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'RATING_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'RATING_UPDATE_ERROR') {
    super(message, code);
    this.name = 'RatingUpdateException';
  }
} 