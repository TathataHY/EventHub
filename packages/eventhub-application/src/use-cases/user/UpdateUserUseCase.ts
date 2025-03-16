import { Injectable } from '@nestjs/common';
import { User, UserRepository, UserUpdateException } from 'eventhub-domain';
import { UserDto } from '../../dtos/user/UserDto';
import { UpdateUserDto } from '../../dtos/user/UpdateUserDto';

/**
 * Caso de uso para actualizar un usuario
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param id ID del usuario a actualizar
   * @param updateUserDto Datos para actualizar
   * @returns Datos actualizados del usuario
   * @throws Error si el usuario no existe o si hay un error en la actualización
   */
  async execute(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      // Verificar si el usuario existe
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar los campos recibidos
      if (updateUserDto.name !== undefined) {
        existingUser.name = updateUserDto.name;
      }

      if (updateUserDto.email !== undefined) {
        // Verificar si ya existe otro usuario con ese email
        const userWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
        if (userWithEmail && userWithEmail.id !== id) {
          throw new Error('El email ya está en uso por otro usuario');
        }
        existingUser.email = updateUserDto.email;
      }

      if (updateUserDto.password !== undefined) {
        existingUser.updatePassword(updateUserDto.password);
      }

      if (updateUserDto.role !== undefined) {
        existingUser.role = updateUserDto.role;
      }

      if (updateUserDto.isActive !== undefined) {
        if (updateUserDto.isActive) {
          existingUser.activate();
        } else {
          existingUser.deactivate();
        }
      }

      // Guardar los cambios
      const updatedUser = await this.userRepository.update(existingUser);

      // Transformar a DTO para la respuesta
      return this.toDto(updatedUser);
    } catch (error) {
      // Manejar excepciones específicas del dominio
      if (error instanceof UserUpdateException) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
      }

      // Re-lanzar el error original si no es una excepción específica
      throw error;
    }
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