import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Enumeración que define los posibles estados de un ticket
 */
export enum TicketStatusEnum {
  /** Ticket disponible para compra */
  AVAILABLE = 'AVAILABLE',
  /** Ticket reservado temporalmente */
  RESERVED = 'RESERVED',
  /** Ticket vendido */
  SOLD = 'SOLD',
  /** Ticket utilizado/escaneado en el evento */
  USED = 'USED',
  /** Ticket expirado, ya no es válido */
  EXPIRED = 'EXPIRED',
  /** Ticket cancelado por el usuario o administrador */
  CANCELLED = 'CANCELLED'
}

/**
 * Objeto de valor que representa el estado de un ticket
 * Implementa las reglas de negocio relacionadas con los diferentes estados de un ticket
 */
export class TicketStatus implements ValueObject<TicketStatusEnum> {
  /**
   * Valor interno del estado del ticket
   */
  private readonly _value: TicketStatusEnum;

  /**
   * Constructor privado para garantizar la creación a través del método factory
   * @param value Valor del estado del ticket
   */
  private constructor(value: TicketStatusEnum) {
    this._value = value;
  }

  /**
   * Crea una nueva instancia de TicketStatus
   * @param value Valor del estado del ticket
   * @returns Nueva instancia de TicketStatus
   */
  static create(value: TicketStatusEnum): TicketStatus {
    return new TicketStatus(value);
  }

  /**
   * Obtiene el valor del estado del ticket
   * @returns Valor del estado del ticket
   */
  value(): TicketStatusEnum {
    return this._value;
  }

  /**
   * Compara si dos objetos de valor TicketStatus son iguales
   * @param vo Objeto de valor a comparar
   * @returns true si los objetos son iguales
   */
  equals(vo: ValueObject<TicketStatusEnum>): boolean {
    return this.value() === vo.value();
  }

  /**
   * Representación en string del estado del ticket
   * @returns String representando el estado del ticket
   */
  toString(): string {
    return String(this._value);
  }

  /**
   * Verifica si el ticket está disponible
   * @returns true si está disponible
   */
  isAvailable(): boolean {
    return this._value === TicketStatusEnum.AVAILABLE;
  }

  /**
   * Verifica si el ticket está reservado
   * @returns true si está reservado
   */
  isReserved(): boolean {
    return this._value === TicketStatusEnum.RESERVED;
  }

  /**
   * Verifica si el ticket está vendido
   * @returns true si está vendido
   */
  isSold(): boolean {
    return this._value === TicketStatusEnum.SOLD;
  }

  /**
   * Verifica si el ticket ya fue utilizado
   * @returns true si ya fue utilizado
   */
  isUsed(): boolean {
    return this._value === TicketStatusEnum.USED;
  }

  /**
   * Verifica si el ticket ha expirado
   * @returns true si ha expirado
   */
  isExpired(): boolean {
    return this._value === TicketStatusEnum.EXPIRED;
  }

  /**
   * Verifica si el ticket ha sido cancelado
   * @returns true si ha sido cancelado
   */
  isCancelled(): boolean {
    return this._value === TicketStatusEnum.CANCELLED;
  }
} 