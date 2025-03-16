/**
 * DTO para la representación de usuarios
 */
export interface UserDto {
  /**
   * Identificador único del usuario
   */
  id: string;

  /**
   * Nombre completo del usuario
   */
  name: string;

  /**
   * Correo electrónico del usuario
   */
  email: string;

  /**
   * Roles asignados al usuario
   */
  roles: string[];

  /**
   * Fecha de creación del usuario
   */
  createdAt: Date | string;

  /**
   * Fecha de última actualización del usuario
   */
  updatedAt: Date | string;
} 