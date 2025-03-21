import { Role } from '@eventhub/domain/dist/users/value-objects/Role';

/**
 * DTO para representar un usuario en la aplicación
 */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 