import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Valores permitidos para el rol de un miembro en un grupo
 */
export enum GroupMemberRoleEnum {
  ADMIN = 'ADMIN',   // Administrador del grupo
  MEMBER = 'MEMBER'  // Miembro regular
}

/**
 * Value Object para el rol de un miembro en un grupo
 * Encapsula y valida el rol, asegurando que sea uno de los valores permitidos
 */
export class GroupMemberRole implements ValueObject<GroupMemberRoleEnum> {
  private readonly _value: GroupMemberRoleEnum;

  /**
   * Constructor privado de GroupMemberRole
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(role: GroupMemberRoleEnum) {
    this._value = role;
  }

  /**
   * Crea un nuevo rol de miembro
   * @param role Rol del miembro
   * @returns Instancia de GroupMemberRole
   * @throws Error si el rol no es válido
   */
  public static create(role: string): GroupMemberRole {
    if (!Object.values(GroupMemberRoleEnum).includes(role as GroupMemberRoleEnum)) {
      throw new Error(`Rol de miembro inválido: ${role}`);
    }
    
    return new GroupMemberRole(role as GroupMemberRoleEnum);
  }

  /**
   * Crea un rol ADMIN
   * @returns Rol de miembro ADMIN
   */
  public static admin(): GroupMemberRole {
    return new GroupMemberRole(GroupMemberRoleEnum.ADMIN);
  }

  /**
   * Crea un rol MEMBER
   * @returns Rol de miembro MEMBER
   */
  public static member(): GroupMemberRole {
    return new GroupMemberRole(GroupMemberRoleEnum.MEMBER);
  }

  /**
   * Obtiene el valor del rol
   * @returns Valor del rol
   */
  public value(): GroupMemberRoleEnum {
    return this._value;
  }

  /**
   * Compara si este rol es igual a otro
   * @param other Otro rol para comparar
   * @returns true si los roles son iguales
   */
  public equals(other: ValueObject<GroupMemberRoleEnum>): boolean {
    if (!(other instanceof GroupMemberRole)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el rol es ADMIN
   * @returns true si el rol es ADMIN
   */
  public isAdmin(): boolean {
    return this._value === GroupMemberRoleEnum.ADMIN;
  }

  /**
   * Comprueba si el rol es MEMBER
   * @returns true si el rol es MEMBER
   */
  public isMember(): boolean {
    return this._value === GroupMemberRoleEnum.MEMBER;
  }

  /**
   * Convierte el rol a string
   * @returns Representación string del rol
   */
  public toString(): string {
    return this._value;
  }
} 