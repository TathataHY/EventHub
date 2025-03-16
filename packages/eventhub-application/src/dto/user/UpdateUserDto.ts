/**
 * DTO para la actualización de usuarios
 */
export interface UpdateUserDto {
  /**
   * Nombre completo del usuario
   * @example "Juan Pérez"
   */
  name?: string;

  /**
   * Correo electrónico del usuario
   * @example "juan.perez@example.com"
   */
  email?: string;

  /**
   * Contraseña del usuario
   * @example "password123"
   */
  password?: string;
} 