import { User } from 'eventhub-domain';
import { UserDto } from 'eventhub-application';

/**
 * Mapper para convertir entre entidad User y DTO
 */
export class UserMapper {
  /**
   * Convierte una entidad User a un DTO
   * @param user Entidad User
   * @returns DTO del usuario
   */
  static toDto(user: User): UserDto {
    return {
      id: user.id as string,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      preferences: user.preferences || {},
      metadata: user.metadata || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Convierte un array de entidades User a un array de DTOs
   * @param users Array de entidades User
   * @returns Array de DTOs
   */
  static toDtoArray(users: User[]): UserDto[] {
    return users.map(user => this.toDto(user));
  }
} 