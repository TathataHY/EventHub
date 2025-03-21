/**
 * DTO para crear un usuario nuevo
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
} 