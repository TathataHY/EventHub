import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Proveedores de pago soportados por el sistema
 * 
 * Define los diferentes proveedores de servicios de pago
 * que pueden ser utilizados para procesar transacciones.
 */
export enum PaymentProviderEnum {
  /** Procesador de pagos Stripe */
  STRIPE = 'STRIPE',         // Proveedor de pagos Stripe
  /** Procesador de pagos PayPal */
  PAYPAL = 'PAYPAL',         // Proveedor de pagos PayPal
  /** Pasarela de pagos Mercado Pago */
  MERCADO_PAGO = 'MERCADO_PAGO', // Proveedor de pagos MercadoPago
  /** Procesamiento manual (efectivo, transferencia, etc.) */
  MANUAL = 'MANUAL'
}

/**
 * Value Object para el proveedor de pagos
 * 
 * Encapsula y valida el proveedor de pagos utilizado para una transacción,
 * asegurando que solo pueda tener valores permitidos según la configuración
 * del sistema. Proporciona métodos para verificar el proveedor actual.
 * 
 * Este objeto es inmutable y proporciona validación en su creación.
 * 
 * @implements {ValueObject<PaymentProviderEnum>} Implementa la interfaz ValueObject
 */
export class PaymentProvider implements ValueObject<PaymentProviderEnum> {
  /** Valor interno del proveedor de pagos */
  private readonly _value: PaymentProviderEnum;

  /**
   * Constructor privado de PaymentProvider
   * @param provider Proveedor de pagos válido
   * @private Se utiliza el patrón Factory para su creación
   */
  private constructor(provider: PaymentProviderEnum) {
    this._value = provider;
  }

  /**
   * Obtiene el valor interno del proveedor
   * @returns El valor del enum correspondiente al proveedor
   */
  public value(): PaymentProviderEnum {
    return this._value;
  }

  /**
   * Crea una instancia para el proveedor Stripe
   * @returns Nueva instancia de PaymentProvider configurada como Stripe
   */
  public static stripe(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.STRIPE);
  }

  /**
   * Crea una instancia para el proveedor PayPal
   * @returns Nueva instancia de PaymentProvider configurada como PayPal
   */
  public static paypal(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.PAYPAL);
  }

  /**
   * Crea una instancia para el proveedor Mercado Pago
   * @returns Nueva instancia de PaymentProvider configurada como Mercado Pago
   */
  public static mercadopago(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.MERCADO_PAGO);
  }

  /**
   * Crea una instancia para el proveedor Manual
   * @returns Nueva instancia de PaymentProvider configurada como Manual
   */
  public static manual(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.MANUAL);
  }

  /**
   * Crea una instancia a partir de un valor de enum
   * @param provider Valor del enum del proveedor
   * @returns Nueva instancia de PaymentProvider
   * @throws Error si el proveedor no es válido
   */
  public static fromValue(provider: PaymentProviderEnum): PaymentProvider {
    if (!Object.values(PaymentProviderEnum).includes(provider)) {
      throw new Error(`Invalid payment provider: ${provider}`);
    }
    return new PaymentProvider(provider);
  }

  /**
   * Verifica si el proveedor es Stripe
   * @returns true si el proveedor es Stripe
   */
  public isStripe(): boolean {
    return this._value === PaymentProviderEnum.STRIPE;
  }

  /**
   * Verifica si el proveedor es PayPal
   * @returns true si el proveedor es PayPal
   */
  public isPaypal(): boolean {
    return this._value === PaymentProviderEnum.PAYPAL;
  }

  /**
   * Verifica si el proveedor es Mercado Pago
   * @returns true si el proveedor es Mercado Pago
   */
  public isMercadopago(): boolean {
    return this._value === PaymentProviderEnum.MERCADO_PAGO;
  }

  /**
   * Verifica si el proveedor es Manual
   * @returns true si el proveedor es Manual
   */
  public isManual(): boolean {
    return this._value === PaymentProviderEnum.MANUAL;
  }

  /**
   * Compara si este proveedor es igual a otro
   * @param valueObject Otro objeto de valor para comparar
   * @returns true si ambos proveedores son iguales
   */
  public equals(valueObject: ValueObject<PaymentProviderEnum>): boolean {
    return this.value() === valueObject.value();
  }

  /**
   * Convierte el proveedor a string
   * @returns Representación en string del proveedor
   */
  public toString(): string {
    return this.value();
  }
} 