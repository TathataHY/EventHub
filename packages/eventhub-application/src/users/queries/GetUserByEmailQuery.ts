import { QueryWithoutParams } from '../../core/interfaces/Query';
import { UserDTO } from '../dtos/UserDTO';
import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';
import { UserMapper } from '../mappers/UserMapper';

/**
 * Query para obtener un usuario por su email
 */
export class GetUserByEmailQuery implements QueryWithoutParams<UserDTO | null> {
  constructor(
    private readonly email: string,
    private readonly userRepository: UserRepositoryAdapter
  ) {}

  /**
   * Ejecuta la query para obtener un usuario por email
   * @returns Promise<UserDTO | null>
   */
  async execute(): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmail(this.email);
    
    if (!user) {
      return null;
    }
    
    return UserMapper.toDTO(user);
  }
} 