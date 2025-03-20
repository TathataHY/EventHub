import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Enum para definir los roles de usuario disponibles en el sistema
 */
export enum RoleEnum {
  ADMIN = 'ADMIN',         // Administrador con acceso completo
  USER = 'USER',           // Usuario regular
  MODERATOR = 'MODERATOR'  // Moderador con acceso parcial
}

/**
 * Value Object para el rol de un usuario
 * Encapsula y valida el rol, asegurando que sea uno de los valores permitidos
 */
export class Role implements ValueObject<RoleEnum> {
  private readonly _value: RoleEnum;

  /**
   * Constructor privado de Role
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(role: RoleEnum) {
    this._value = role;
  }

  /**
   * Crea un nuevo rol
   * @param role Rol del usuario
   * @returns Instancia de Role
   * @throws Error si el rol no es válido
   */
  public static create(role: string): Role {
    if (!Object.values(RoleEnum).includes(role as RoleEnum)) {
      throw new Error(`Rol no válido: ${role}. Roles disponibles: ${Object.values(RoleEnum).join(', ')}`);
    }
    
    return new Role(role as RoleEnum);
  }

  /**
   * Crea un rol ADMIN
   * @returns Rol de usuario ADMIN
   */
  public static admin(): Role {
    return new Role(RoleEnum.ADMIN);
  }

  /**
   * Crea un rol USER
   * @returns Rol de usuario USER
   */
  public static user(): Role {
    return new Role(RoleEnum.USER);
  }

  /**
   * Crea un rol MODERATOR
   * @returns Rol de usuario MODERATOR
   */
  public static moderator(): Role {
    return new Role(RoleEnum.MODERATOR);
  }

  /**
   * Obtiene el valor del rol
   * @returns Valor del rol
   */
  public value(): RoleEnum {
    return this._value;
  }

  /**
   * Compara si este rol es igual a otro
   * @param other Otro rol para comparar
   * @returns true si los roles son iguales
   */
  public equals(other: ValueObject<RoleEnum>): boolean {
    if (!(other instanceof Role)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Comprueba si el rol es ADMIN
   * @returns true si el rol es ADMIN
   */
  public isAdmin(): boolean {
    return this._value === RoleEnum.ADMIN;
  }

  /**
   * Comprueba si el rol es USER
   * @returns true si el rol es USER
   */
  public isUser(): boolean {
    return this._value === RoleEnum.USER;
  }

  /**
   * Comprueba si el rol es MODERATOR
   * @returns true si el rol es MODERATOR
   */
  public isModerator(): boolean {
    return this._value === RoleEnum.MODERATOR;
  }

  /**
   * Convierte el rol a string
   * @returns Representación string del rol
   */
  public toString(): string {
    return this._value;
  }
} 
} 