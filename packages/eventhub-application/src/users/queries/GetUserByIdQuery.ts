import { QueryWithOneParam } from '../../core/interfaces/Query';
import { UserDTO } from '../dtos/UserDTO';
import { UserMapper } from '../mappers/UserMapper';
import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Query para obtener un usuario por su ID
 */
export class GetUserByIdQuery implements QueryWithOneParam<string, UserDTO> {
  constructor(private readonly userRepository: UserRepositoryAdapter) {}

  /**
   * Ejecuta la query para obtener un usuario por ID
   * @param userId ID del usuario a buscar
   * @returns Promise<UserDTO>
   * @throws NotFoundException si no se encuentra el usuario
   */
  async execute(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findUserById(userId);
    
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }
    
    return UserMapper.toDTO(user);
  }
} 