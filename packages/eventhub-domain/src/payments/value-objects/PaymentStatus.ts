import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Valores permitidos para el estado de un pago
 * 
 * Define los estados posibles por los que puede pasar un pago en el sistema.
 * Cada estado representa una etapa diferente del ciclo de vida de una transacción.
 */
export enum PaymentStatusEnum {
  /** Pago iniciado pero aún no procesado completamente */
  PENDING = 'PENDING',     
  
  /** Pago procesado exitosamente por el proveedor de pagos */
  COMPLETED = 'COMPLETED', 
  
  /** Pago que no pudo ser procesado por algún error */
  FAILED = 'FAILED',       
  
  /** Pago que fue completado pero posteriormente devuelto al cliente */
  REFUNDED = 'REFUNDED',   
  
  /** Pago que fue cancelado antes de ser completado */
  CANCELLED = 'CANCELLED'  
}

/**
 * Value Object para el estado de un pago
 * 
 * Encapsula y valida el estado de un pago, asegurando que solo pueda
 * tener valores permitidos según el negocio. Proporciona métodos
 * para verificar el estado actual y realizar comparaciones.
 * 
 * Este objeto es inmutable y se debe crear una nueva instancia para
 * representar un cambio de estado.
 * 
 * @implements {ValueObject<PaymentStatusEnum>} Implementa la interfaz ValueObject
 */
export class PaymentStatus implements ValueObject<PaymentStatusEnum> {
  /** Valor interno del estado de pago */
  private readonly _value: PaymentStatusEnum;

  /**
   * Constructor privado de PaymentStatus
   * 
   * Se debe acceder a través de métodos factory para garantizar la validación.
   * 
   * @param status Estado del pago validado
   * @private Se utiliza el patrón Factory para su creación
   */
  private constructor(status: PaymentStatusEnum) {
    this._value = status;
  }

  /**
   * Crea un nuevo estado de pago a partir de un string
   * 
   * Valida que el string corresponda a uno de los estados válidos
   * definidos en PaymentStatusEnum.
   * 
   * @param status String que representa el estado del pago
   * @returns Instancia validada de PaymentStatus
   * @throws Error si el estado proporcionado no es válido
   */
  public static create(status: string): PaymentStatus {
    if (!Object.values(PaymentStatusEnum).includes(status as PaymentStatusEnum)) {
      throw new Error(`Estado de pago inválido: ${status}`);
    }
    
    return new PaymentStatus(status as PaymentStatusEnum);
  }

  /**
   * Crea un nuevo estado de pago a partir de un valor de enum
   * 
   * @param status Valor del enum PaymentStatusEnum
   * @returns Instancia validada de PaymentStatus
   */
  public static fromValue(status: PaymentStatusEnum | string): PaymentStatus {
    if (typeof status === 'string') {
      return this.create(status);
    }
    
    return new PaymentStatus(status);
  }

  /**
   * Crea un estado de pago PENDING (pendiente)
   * 
   * Utilizado para indicar que un pago se ha iniciado pero aún
   * no ha sido procesado completamente.
   * 
   * @returns Estado de pago en estado pendiente
   */
  public static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.PENDING);
  }

  /**
   * Crea un estado de pago COMPLETED (completado)
   * 
   * Utilizado para indicar que un pago se ha procesado
   * exitosamente por el proveedor de pagos.
   * 
   * @returns Estado de pago en estado completado
   */
  public static completed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.COMPLETED);
  }

  /**
   * Crea un estado de pago FAILED (fallido)
   * 
   * Utilizado para indicar que un pago no pudo ser procesado
   * debido a un error (fondos insuficientes, tarjeta rechazada, etc.).
   * 
   * @returns Estado de pago en estado fallido
   */
  public static failed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.FAILED);
  }

  /**
   * Crea un estado de pago REFUNDED (reembolsado)
   * 
   * Utilizado para indicar que un pago completado ha sido
   * posteriormente reembolsado al cliente.
   * 
   * @returns Estado de pago en estado reembolsado
   */
  public static refunded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.REFUNDED);
  }

  /**
   * Crea un estado de pago CANCELLED (cancelado)
   * 
   * Utilizado para indicar que un pago ha sido cancelado
   * antes de completarse, generalmente por el usuario o por el sistema.
   * 
   * @returns Estado de pago en estado cancelado
   */
  public static cancelled(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.CANCELLED);
  }

  /**
   * Obtiene el valor actual del estado de pago
   * 
   * @returns El valor enum que representa el estado actual
   */
  public value(): PaymentStatusEnum {
    return this._value;
  }

  /**
   * Compara si este estado de pago es igual a otro
   * 
   * Dos estados son iguales si representan el mismo valor enum.
   * 
   * @param other Otro value object para comparar
   * @returns true si ambos estados son iguales
   */
  public equals(other: ValueObject<PaymentStatusEnum>): boolean {
    if (!(other instanceof PaymentStatus)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Verifica si el pago está en estado pendiente
   * 
   * @returns true si el estado es PENDING
   */
  public isPending(): boolean {
    return this._value === PaymentStatusEnum.PENDING;
  }

  /**
   * Verifica si el pago está en estado completado
   * 
   * @returns true si el estado es COMPLETED
   */
  public isCompleted(): boolean {
    return this._value === PaymentStatusEnum.COMPLETED;
  }

  /**
   * Verifica si el pago está en estado fallido
   * 
   * @returns true si el estado es FAILED
   */
  public isFailed(): boolean {
    return this._value === PaymentStatusEnum.FAILED;
  }

  /**
   * Verifica si el pago está en estado reembolsado
   * 
   * @returns true si el estado es REFUNDED
   */
  public isRefunded(): boolean {
    return this._value === PaymentStatusEnum.REFUNDED;
  }

  /**
   * Verifica si el pago está en estado cancelado
   * 
   * @returns true si el estado es CANCELLED
   */
  public isCancelled(): boolean {
    return this._value === PaymentStatusEnum.CANCELLED;
  }

  /**
   * Convierte el estado de pago a su representación en string
   * 
   * @returns String que representa el estado actual
   */
  public toString(): string {
    return this._value;
  }
} 