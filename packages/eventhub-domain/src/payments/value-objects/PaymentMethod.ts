import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Enum para los métodos de pago soportados
 */
export enum PaymentMethodEnum {
  CREDIT_CARD = 'CREDIT_CARD',   // Tarjeta de crédito
  DEBIT_CARD = 'DEBIT_CARD',     // Tarjeta de débito
  PAYPAL = 'PAYPAL',             // PayPal
  BANK_TRANSFER = 'BANK_TRANSFER', // Transferencia bancaria
  CASH = 'CASH',                 // Efectivo
  CRYPTO = 'CRYPTO',             // Criptomonedas
  OTHER = 'OTHER',               // Otro método no especificado
  UNKNOWN = 'UNKNOWN'            // Desconocido
}

/**
 * Value Object para métodos de pago
 */
export class PaymentMethod implements ValueObject<PaymentMethodEnum> {
  private readonly _value: PaymentMethodEnum;

  private constructor(method: PaymentMethodEnum) {
    this._value = method;
  }

  /**
   * Crea un método de pago a partir de un string
   */
  public static fromString(method: string): PaymentMethod {
    const upperMethod = method.toUpperCase();
    
    if (Object.values(PaymentMethodEnum).includes(upperMethod as PaymentMethodEnum)) {
      return new PaymentMethod(upperMethod as PaymentMethodEnum);
    }
    
    return PaymentMethod.unknown();
  }

  /**
   * Crea una instancia de método tarjeta de crédito
   */
  public static creditCard(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.CREDIT_CARD);
  }

  /**
   * Crea una instancia de método tarjeta de débito
   */
  public static debitCard(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.DEBIT_CARD);
  }

  /**
   * Crea una instancia de método PayPal
   */
  public static paypal(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.PAYPAL);
  }

  /**
   * Crea una instancia de método transferencia bancaria
   */
  public static bankTransfer(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.BANK_TRANSFER);
  }

  /**
   * Crea una instancia de método efectivo
   */
  public static cash(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.CASH);
  }

  /**
   * Crea una instancia de método criptomonedas
   */
  public static crypto(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.CRYPTO);
  }

  /**
   * Crea una instancia de método desconocido
   */
  public static unknown(): PaymentMethod {
    return new PaymentMethod(PaymentMethodEnum.UNKNOWN);
  }

  /**
   * Devuelve el valor del método de pago
   */
  public value(): PaymentMethodEnum {
    return this._value;
  }

  /**
   * Compara con otro ValueObject
   */
  public equals(vo: ValueObject<PaymentMethodEnum>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    
    return this.value() === vo.value();
  }

  /**
   * Verifica si es tarjeta de crédito
   */
  public isCreditCard(): boolean {
    return this._value === PaymentMethodEnum.CREDIT_CARD;
  }

  /**
   * Verifica si es tarjeta de débito
   */
  public isDebitCard(): boolean {
    return this._value === PaymentMethodEnum.DEBIT_CARD;
  }

  /**
   * Verifica si es cualquier tipo de tarjeta
   */
  public isCard(): boolean {
    return this.isCreditCard() || this.isDebitCard();
  }

  /**
   * Verifica si es PayPal
   */
  public isPaypal(): boolean {
    return this._value === PaymentMethodEnum.PAYPAL;
  }

  /**
   * Verifica si es transferencia bancaria
   */
  public isBankTransfer(): boolean {
    return this._value === PaymentMethodEnum.BANK_TRANSFER;
  }

  /**
   * Devuelve la representación como string
   */
  public toString(): string {
    return this._value;
  }
} 