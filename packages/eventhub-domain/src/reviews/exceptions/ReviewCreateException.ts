import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de reseñas
 * 
 * Se lanza cuando ocurre un error durante el proceso de creación de una reseña,
 * por ejemplo, cuando se proporcionan datos inválidos como una puntuación fuera
 * de rango, falta de identificadores necesarios, o se incumplen otras reglas de
 * negocio específicas para las reseñas.
 * 
 * @extends {DomainException} Hereda de la excepción base del dominio
 */
export class ReviewCreateException extends DomainException {
  /**
   * Constructor de ReviewCreateException
   * 
   * @param message Mensaje descriptivo que explica la razón del error
   * @param code Código de error para identificar el tipo de problema (por defecto 'REVIEW_CREATE_ERROR')
   * 
   * @example
   * // Lanzar una excepción por puntuación inválida
   * throw new ReviewCreateException('La puntuación debe estar entre 1 y 5');
   */
  constructor(message: string, code: string = 'REVIEW_CREATE_ERROR') {
    super(message, code);
    this.name = 'ReviewCreateException';
  }
} 