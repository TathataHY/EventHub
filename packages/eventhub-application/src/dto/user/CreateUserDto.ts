/**
 * DTO para la creación de usuarios
 */
export interface CreateUserDto {
  /**
   * Nombre completo del usuario
   * @example "Juan Pérez"
   */
  name: string;

  /**
   * Correo electrónico del usuario (debe ser único)
   * @example "juan.perez@example.com"
   */
  email: string;

  /**
   * Contraseña del usuario (mínimo 6 caracteres)
   * @example "password123"
   */
  password: string;
} 