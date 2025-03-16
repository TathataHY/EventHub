import { Injectable } from '@nestjs/common';
import { User, UserRepository } from 'eventhub-domain';
import { UserDto } from '../../dtos/user/UserDto';

/**
 * Caso de uso para obtener un usuario por su ID
 */
@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param id ID del usuario a buscar
   * @returns Datos del usuario encontrado
   * @throws Error si el usuario no existe
   */
  async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.toDto(user);
  }

  /**
   * Convierte una entidad de dominio a un DTO
   */
  private toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
} 