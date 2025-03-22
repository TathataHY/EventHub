import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción lanzada cuando ocurre un error en la creación de un pago
 * 
 * Esta excepción se utiliza para encapsular los diversos errores que pueden ocurrir 
 * durante el proceso de creación de un pago, como datos inválidos, problemas con 
 * el proveedor de pagos, información de tarjeta incorrecta, o errores de validación.
 * 
 * Al extender DomainException, mantiene la consistencia con el patrón de manejo
 * de excepciones del dominio y permite un tratamiento uniforme de los errores.
 * 
 * @extends {DomainException} Hereda de la excepción base del dominio
 */
export class PaymentCreateException extends DomainException {
  /**
   * Constructor de PaymentCreateException
   * 
   * Crea una nueva instancia de la excepción con un mensaje descriptivo
   * y opcionalmente un código de error personalizado.
   * 
   * @param message Mensaje descriptivo que explica la causa del error
   * @param code Código de error para categorizar el problema (por defecto 'PAYMENT_CREATE_ERROR')
   */
  constructor(message: string, code: string = 'PAYMENT_CREATE_ERROR') {
    super(message, code);
    this.name = 'PaymentCreateException';
  }
} 