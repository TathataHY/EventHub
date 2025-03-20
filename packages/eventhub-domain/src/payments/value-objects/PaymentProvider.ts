import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Valores permitidos para los proveedores de pago
 */
export enum PaymentProviderEnum {
  STRIPE = 'STRIPE',         // Proveedor de pagos Stripe
  PAYPAL = 'PAYPAL',         // Proveedor de pagos PayPal
  MERCADOPAGO = 'MERCADOPAGO' // Proveedor de pagos MercadoPago
}

/**
 * Value Object para el proveedor de pago
 * Encapsula y valida el proveedor, asegurando que sea uno de los valores permitidos
 */
export class PaymentProvider implements ValueObject<PaymentProviderEnum> {
  private readonly _value: PaymentProviderEnum;

  /**
   * Constructor privado de PaymentProvider
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(provider: PaymentProviderEnum) {
    this._value = provider;
  }

  /**
   * Crea un nuevo proveedor de pago
   * @param provider Proveedor de pago
   * @returns Instancia de PaymentProvider
   * @throws Error si el proveedor no es válido
   */
  public static create(provider: string): PaymentProvider {
    if (!Object.values(PaymentProviderEnum).includes(provider as PaymentProviderEnum)) {
      throw new Error(`Proveedor de pago inválido: ${provider}`);
    }
    
    return new PaymentProvider(provider as PaymentProviderEnum);
  }

  /**
   * Crea un proveedor STRIPE
   * @returns Proveedor de pago STRIPE
   */
  public static stripe(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.STRIPE);
  }

  /**
   * Crea un proveedor PAYPAL
   * @returns Proveedor de pago PAYPAL
   */
  public static paypal(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.PAYPAL);
  }

  /**
   * Crea un proveedor MERCADOPAGO
   * @returns Proveedor de pago MERCADOPAGO
   */
  public static mercadopago(): PaymentProvider {
    return new PaymentProvider(PaymentProviderEnum.MERCADOPAGO);
  }

  /**
   * Obtiene el valor del proveedor
   * @returns Valor del proveedor
   */
  public value(): PaymentProviderEnum {
    return this._value;
  }

  /**
   * Compara si este proveedor es igual a otro
   * @param other Otro proveedor para comparar
   * @returns true si los proveedores son iguales
   */
  public equals(other: ValueObject<PaymentProviderEnum>): boolean {
    if (!(other instanceof PaymentProvider)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el proveedor es STRIPE
   * @returns true si el proveedor es STRIPE
   */
  public isStripe(): boolean {
    return this._value === PaymentProviderEnum.STRIPE;
  }

  /**
   * Comprueba si el proveedor es PAYPAL
   * @returns true si el proveedor es PAYPAL
   */
  public isPaypal(): boolean {
    return this._value === PaymentProviderEnum.PAYPAL;
  }

  /**
   * Comprueba si el proveedor es MERCADOPAGO
   * @returns true si el proveedor es MERCADOPAGO
   */
  public isMercadopago(): boolean {
    return this._value === PaymentProviderEnum.MERCADOPAGO;
  }

  /**
   * Convierte el proveedor a string
   * @returns Representación string del proveedor
   */
  public toString(): string {
    return this._value;
  }
} 