import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la actualización de pagos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class PaymentUpdateException extends DomainException {
  /**
   * Constructor de PaymentUpdateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'PAYMENT_UPDATE_ERROR')
   */
  constructor(message: string, code: string = 'PAYMENT_UPDATE_ERROR') {
    super(message, code);
    this.name = 'PaymentUpdateException';
  }
} 