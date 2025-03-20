import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Valores permitidos para el estado de un grupo
 */
export enum GroupStatusEnum {
  ACTIVE = 'ACTIVE',     // Grupo activo y operativo
  INACTIVE = 'INACTIVE', // Grupo temporalmente inactivo
  CLOSED = 'CLOSED'      // Grupo cerrado permanentemente
}

/**
 * Value Object para el estado de un grupo
 * Encapsula y valida el estado, asegurando que sea uno de los valores permitidos
 */
export class GroupStatus implements ValueObject<GroupStatusEnum> {
  private readonly _value: GroupStatusEnum;

  /**
   * Constructor privado de GroupStatus
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(status: GroupStatusEnum) {
    this._value = status;
  }

  /**
   * Crea un nuevo estado de grupo
   * @param status Estado del grupo
   * @returns Instancia de GroupStatus
   * @throws Error si el estado no es válido
   */
  public static create(status: string): GroupStatus {
    if (!Object.values(GroupStatusEnum).includes(status as GroupStatusEnum)) {
      throw new Error(`Estado de grupo inválido: ${status}`);
    }
    
    return new GroupStatus(status as GroupStatusEnum);
  }

  /**
   * Crea un estado ACTIVE
   * @returns Estado de grupo ACTIVE
   */
  public static active(): GroupStatus {
    return new GroupStatus(GroupStatusEnum.ACTIVE);
  }

  /**
   * Crea un estado INACTIVE
   * @returns Estado de grupo INACTIVE
   */
  public static inactive(): GroupStatus {
    return new GroupStatus(GroupStatusEnum.INACTIVE);
  }

  /**
   * Crea un estado CLOSED
   * @returns Estado de grupo CLOSED
   */
  public static closed(): GroupStatus {
    return new GroupStatus(GroupStatusEnum.CLOSED);
  }

  /**
   * Obtiene el valor del estado
   * @returns Valor del estado
   */
  public value(): GroupStatusEnum {
    return this._value;
  }

  /**
   * Compara si este estado es igual a otro
   * @param other Otro estado para comparar
   * @returns true si los estados son iguales
   */
  public equals(other: ValueObject<GroupStatusEnum>): boolean {
    if (!(other instanceof GroupStatus)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el estado es ACTIVE
   * @returns true si el estado es ACTIVE
   */
  public isActive(): boolean {
    return this._value === GroupStatusEnum.ACTIVE;
  }

  /**
   * Comprueba si el estado es INACTIVE
   * @returns true si el estado es INACTIVE
   */
  public isInactive(): boolean {
    return this._value === GroupStatusEnum.INACTIVE;
  }

  /**
   * Comprueba si el estado es CLOSED
   * @returns true si el estado es CLOSED
   */
  public isClosed(): boolean {
    return this._value === GroupStatusEnum.CLOSED;
  }

  /**
   * Convierte el estado a string
   * @returns Representación string del estado
   */
  public toString(): string {
    return this._value;
  }
} 