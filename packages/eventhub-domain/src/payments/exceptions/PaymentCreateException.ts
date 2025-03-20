import { DomainException } from '../../../core/exceptions/DomainException';

/**
 * Excepción específica para errores en la creación de pagos
 * Extiende DomainException para mantener consistencia en el manejo de errores
 */
export class PaymentCreateException extends DomainException {
  /**
   * Constructor de PaymentCreateException
   * @param message Mensaje descriptivo del error
   * @param code Código de error opcional (por defecto 'PAYMENT_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'PAYMENT_CREATE_ERROR') {
    super(message, code);
    this.name = 'PaymentCreateException';
  }
} 