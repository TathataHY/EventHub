/**
 * DTO para actualizar un usuario existente
 */
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
} 