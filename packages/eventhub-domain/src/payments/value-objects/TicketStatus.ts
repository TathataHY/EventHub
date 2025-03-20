import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Valores permitidos para el estado de un ticket
 */
export enum TicketStatusEnum {
  VALID = 'VALID',         // Ticket válido y no utilizado
  USED = 'USED',           // Ticket ya utilizado
  CANCELLED = 'CANCELLED', // Ticket cancelado
  EXPIRED = 'EXPIRED'      // Ticket expirado
}

/**
 * Value Object para el estado de un ticket
 * Encapsula y valida el estado, asegurando que sea uno de los valores permitidos
 */
export class TicketStatus implements ValueObject<TicketStatusEnum> {
  private readonly _value: TicketStatusEnum;

  /**
   * Constructor privado de TicketStatus
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(status: TicketStatusEnum) {
    this._value = status;
  }

  /**
   * Crea un nuevo estado de ticket
   * @param status Estado del ticket
   * @returns Instancia de TicketStatus
   * @throws Error si el estado no es válido
   */
  public static create(status: string): TicketStatus {
    if (!Object.values(TicketStatusEnum).includes(status as TicketStatusEnum)) {
      throw new Error(`Estado de ticket inválido: ${status}`);
    }
    
    return new TicketStatus(status as TicketStatusEnum);
  }

  /**
   * Crea un estado VALID
   * @returns Estado de ticket VALID
   */
  public static valid(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.VALID);
  }

  /**
   * Crea un estado USED
   * @returns Estado de ticket USED
   */
  public static used(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.USED);
  }

  /**
   * Crea un estado CANCELLED
   * @returns Estado de ticket CANCELLED
   */
  public static cancelled(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.CANCELLED);
  }

  /**
   * Crea un estado EXPIRED
   * @returns Estado de ticket EXPIRED
   */
  public static expired(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.EXPIRED);
  }

  /**
   * Obtiene el valor del estado
   * @returns Valor del estado
   */
  public value(): TicketStatusEnum {
    return this._value;
  }

  /**
   * Compara si este estado es igual a otro
   * @param other Otro estado para comparar
   * @returns true si los estados son iguales
   */
  public equals(other: ValueObject<TicketStatusEnum>): boolean {
    if (!(other instanceof TicketStatus)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el estado es VALID
   * @returns true si el estado es VALID
   */
  public isValid(): boolean {
    return this._value === TicketStatusEnum.VALID;
  }

  /**
   * Comprueba si el estado es USED
   * @returns true si el estado es USED
   */
  public isUsed(): boolean {
    return this._value === TicketStatusEnum.USED;
  }

  /**
   * Comprueba si el estado es CANCELLED
   * @returns true si el estado es CANCELLED
   */
  public isCancelled(): boolean {
    return this._value === TicketStatusEnum.CANCELLED;
  }

  /**
   * Comprueba si el estado es EXPIRED
   * @returns true si el estado es EXPIRED
   */
  public isExpired(): boolean {
    return this._value === TicketStatusEnum.EXPIRED;
  }

  /**
   * Convierte el estado a string
   * @returns Representación string del estado
   */
  public toString(): string {
    return this._value;
  }
} 