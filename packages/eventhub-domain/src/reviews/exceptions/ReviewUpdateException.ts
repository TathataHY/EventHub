import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de reseñas
 * 
 * Se lanza cuando ocurre un error durante el proceso de modificación de una reseña
 * existente, como cuando se intenta actualizar una reseña que está inactiva o
 * verificada, cuando se proporciona una puntuación inválida, o cuando se incumplen
 * otras reglas de negocio relacionadas con la actualización de reseñas.
 * 
 * @extends {DomainException} Hereda de la excepción base del dominio
 */
export class ReviewUpdateException extends DomainException {
  /**
   * Constructor de ReviewUpdateException
   * 
   * @param message Mensaje descriptivo que explica la razón del error
   * @param code Código de error para identificar el tipo de problema (por defecto 'REVIEW_UPDATE_ERROR')
   * 
   * @example
   * // Lanzar una excepción por intentar actualizar una reseña verificada
   * throw new ReviewUpdateException('No se puede actualizar una reseña verificada');
   */
  constructor(message: string, code: string = 'REVIEW_UPDATE_ERROR') {
    super(message, code);
    this.name = 'ReviewUpdateException';
  }
} 