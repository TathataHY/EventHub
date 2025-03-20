import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Valores permitidos para el estado de un pago
 */
export enum PaymentStatusEnum {
  PENDING = 'PENDING',     // Pago pendiente de completar
  COMPLETED = 'COMPLETED', // Pago completado exitosamente
  FAILED = 'FAILED',       // Pago fallido
  REFUNDED = 'REFUNDED',   // Pago reembolsado
  CANCELLED = 'CANCELLED'  // Pago cancelado
}

/**
 * Value Object para el estado de un pago
 * Encapsula y valida el estado, asegurando que sea uno de los valores permitidos
 */
export class PaymentStatus implements ValueObject<PaymentStatusEnum> {
  private readonly _value: PaymentStatusEnum;

  /**
   * Constructor privado de PaymentStatus
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(status: PaymentStatusEnum) {
    this._value = status;
  }

  /**
   * Crea un nuevo estado de pago
   * @param status Estado del pago
   * @returns Instancia de PaymentStatus
   * @throws Error si el estado no es válido
   */
  public static create(status: string): PaymentStatus {
    if (!Object.values(PaymentStatusEnum).includes(status as PaymentStatusEnum)) {
      throw new Error(`Estado de pago inválido: ${status}`);
    }
    
    return new PaymentStatus(status as PaymentStatusEnum);
  }

  /**
   * Crea un estado PENDING
   * @returns Estado de pago PENDING
   */
  public static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.PENDING);
  }

  /**
   * Crea un estado COMPLETED
   * @returns Estado de pago COMPLETED
   */
  public static completed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.COMPLETED);
  }

  /**
   * Crea un estado FAILED
   * @returns Estado de pago FAILED
   */
  public static failed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.FAILED);
  }

  /**
   * Crea un estado REFUNDED
   * @returns Estado de pago REFUNDED
   */
  public static refunded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.REFUNDED);
  }

  /**
   * Crea un estado CANCELLED
   * @returns Estado de pago CANCELLED
   */
  public static cancelled(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.CANCELLED);
  }

  /**
   * Obtiene el valor del estado
   * @returns Valor del estado
   */
  public value(): PaymentStatusEnum {
    return this._value;
  }

  /**
   * Compara si este estado es igual a otro
   * @param other Otro estado para comparar
   * @returns true si los estados son iguales
   */
  public equals(other: ValueObject<PaymentStatusEnum>): boolean {
    if (!(other instanceof PaymentStatus)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el estado es PENDING
   * @returns true si el estado es PENDING
   */
  public isPending(): boolean {
    return this._value === PaymentStatusEnum.PENDING;
  }

  /**
   * Comprueba si el estado es COMPLETED
   * @returns true si el estado es COMPLETED
   */
  public isCompleted(): boolean {
    return this._value === PaymentStatusEnum.COMPLETED;
  }

  /**
   * Comprueba si el estado es FAILED
   * @returns true si el estado es FAILED
   */
  public isFailed(): boolean {
    return this._value === PaymentStatusEnum.FAILED;
  }

  /**
   * Comprueba si el estado es REFUNDED
   * @returns true si el estado es REFUNDED
   */
  public isRefunded(): boolean {
    return this._value === PaymentStatusEnum.REFUNDED;
  }

  /**
   * Comprueba si el estado es CANCELLED
   * @returns true si el estado es CANCELLED
   */
  public isCancelled(): boolean {
    return this._value === PaymentStatusEnum.CANCELLED;
  }

  /**
   * Convierte el estado a string
   * @returns Representación string del estado
   */
  public toString(): string {
    return this._value;
  }
} 