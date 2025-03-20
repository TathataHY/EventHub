import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Valores permitidos para el estado de un miembro en un grupo
 */
export enum GroupMemberStatusEnum {
  ACTIVE = 'ACTIVE',       // Miembro activo
  INACTIVE = 'INACTIVE',   // Miembro inactivo
  PENDING = 'PENDING',     // Invitación pendiente
  REJECTED = 'REJECTED'    // Invitación rechazada
}

/**
 * Value Object para el estado de un miembro en un grupo
 * Encapsula y valida el estado, asegurando que sea uno de los valores permitidos
 */
export class GroupMemberStatus implements ValueObject<GroupMemberStatusEnum> {
  private readonly _value: GroupMemberStatusEnum;

  /**
   * Constructor privado de GroupMemberStatus
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(status: GroupMemberStatusEnum) {
    this._value = status;
  }

  /**
   * Crea un nuevo estado de miembro
   * @param status Estado del miembro
   * @returns Instancia de GroupMemberStatus
   * @throws Error si el estado no es válido
   */
  public static create(status: string): GroupMemberStatus {
    if (!Object.values(GroupMemberStatusEnum).includes(status as GroupMemberStatusEnum)) {
      throw new Error(`Estado de miembro inválido: ${status}`);
    }
    
    return new GroupMemberStatus(status as GroupMemberStatusEnum);
  }

  /**
   * Crea un estado ACTIVE
   * @returns Estado de miembro ACTIVE
   */
  public static active(): GroupMemberStatus {
    return new GroupMemberStatus(GroupMemberStatusEnum.ACTIVE);
  }

  /**
   * Crea un estado INACTIVE
   * @returns Estado de miembro INACTIVE
   */
  public static inactive(): GroupMemberStatus {
    return new GroupMemberStatus(GroupMemberStatusEnum.INACTIVE);
  }

  /**
   * Crea un estado PENDING
   * @returns Estado de miembro PENDING
   */
  public static pending(): GroupMemberStatus {
    return new GroupMemberStatus(GroupMemberStatusEnum.PENDING);
  }

  /**
   * Crea un estado REJECTED
   * @returns Estado de miembro REJECTED
   */
  public static rejected(): GroupMemberStatus {
    return new GroupMemberStatus(GroupMemberStatusEnum.REJECTED);
  }

  /**
   * Obtiene el valor del estado
   * @returns Valor del estado
   */
  public value(): GroupMemberStatusEnum {
    return this._value;
  }

  /**
   * Compara si este estado es igual a otro
   * @param other Otro estado para comparar
   * @returns true si los estados son iguales
   */
  public equals(other: ValueObject<GroupMemberStatusEnum>): boolean {
    if (!(other instanceof GroupMemberStatus)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el estado es ACTIVE
   * @returns true si el estado es ACTIVE
   */
  public isActive(): boolean {
    return this._value === GroupMemberStatusEnum.ACTIVE;
  }

  /**
   * Comprueba si el estado es INACTIVE
   * @returns true si el estado es INACTIVE
   */
  public isInactive(): boolean {
    return this._value === GroupMemberStatusEnum.INACTIVE;
  }

  /**
   * Comprueba si el estado es PENDING
   * @returns true si el estado es PENDING
   */
  public isPending(): boolean {
    return this._value === GroupMemberStatusEnum.PENDING;
  }

  /**
   * Comprueba si el estado es REJECTED
   * @returns true si el estado es REJECTED
   */
  public isRejected(): boolean {
    return this._value === GroupMemberStatusEnum.REJECTED;
  }

  /**
   * Convierte el estado a string
   * @returns Representación string del estado
   */
  public toString(): string {
    return this._value;
  }
} 