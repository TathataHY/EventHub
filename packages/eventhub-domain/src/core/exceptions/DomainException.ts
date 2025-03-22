/**
 * Excepción base para todos los errores del dominio
 * Extiende la clase Error de JavaScript
 */
export class DomainException extends Error {
  /**
   * Constructor de la excepción de dominio
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional
   */
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
} 