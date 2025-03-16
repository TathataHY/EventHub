import { UserRepository } from 'eventhub-domain';
import { UserDto } from '../../dto/user/UserDto';

/**
 * Caso de uso para obtener un usuario por ID
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param id ID del usuario a buscar
   * @returns DTO con los datos del usuario o null si no existe
   */
  async execute(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    // Mapear a DTO para retornar (sin incluir password)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 