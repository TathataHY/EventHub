/**
 * Enum para definir los roles de usuario disponibles en el sistema
 */
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR'
}

/**
 * Clase para encapsular un valor de rol y proporcionar validación
 */
export class RoleValue {
  private readonly value: Role;

  constructor(role: string) {
    // Verificar si el rol es válido
    if (!this.isValidRole(role)) {
      throw new Error(`Rol no válido: ${role}. Roles disponibles: ${Object.values(Role).join(', ')}`);
    }
    this.value = role as Role;
  }

  /**
   * Verifica si un string es un rol válido
   */
  private isValidRole(role: string): boolean {
    return Object.values(Role).includes(role as Role);
  }

  /**
   * Obtiene el valor del rol
   */
  getValue(): Role {
    return this.value;
  }

  /**
   * Verifica si el rol actual es admin
   */
  isAdmin(): boolean {
    return this.value === Role.ADMIN;
  }

  /**
   * Verifica si el rol actual es usuario regular
   */
  isUser(): boolean {
    return this.value === Role.USER;
  }

  /**
   * Verifica si el rol actual es moderador
   */
  isModerator(): boolean {
    return this.value === Role.MODERATOR;
  }
} 