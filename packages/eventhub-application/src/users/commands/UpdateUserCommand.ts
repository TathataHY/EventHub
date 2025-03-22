import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';
import { CommandWithParams } from '../../core/interfaces/Command';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { UserDTO } from '../dtos/UserDTO';
import { UserMapper } from '../mappers/UserMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import * as bcrypt from 'bcrypt';

/**
 * Comando para actualizar un usuario existente
 */
export class UpdateUserCommand implements CommandWithParams<{userId: string; data: UpdateUserDTO}, UserDTO> {
  constructor(private readonly userRepository: UserRepositoryAdapter) {}

  /**
   * Ejecuta el comando para actualizar un usuario
   * @param params Objeto con el ID del usuario y los datos para actualizar
   * @returns DTO del usuario actualizado
   * @throws NotFoundException si el usuario no existe
   */
  async execute(params: {userId: string; data: UpdateUserDTO}): Promise<UserDTO> {
    const { userId, data } = params;
    
    // Verificar que el usuario existe
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    // Verificar si el email no está en uso por otro usuario
    if (data.email && data.email !== user.email.toString()) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new Error(`El email ${data.email} ya está en uso`);
      }
    }

    // Preparar datos para actualizar
    const updateProps = UserMapper.toUpdateProps(data);
    
    // Si hay cambio de contraseña, hashearla
    if (data.password) {
      updateProps.password = await this.hashPassword(data.password);
    }

    // Realizar la actualización
    const updatedUser = await this.userRepository.updateUser(userId, updateProps);
    
    // Convertir a DTO y devolver
    return UserMapper.toDTO(updatedUser);
  }

  /**
   * Hashea la contraseña del usuario
   * @param password Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
} 