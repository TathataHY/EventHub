import { QueryWithoutParams } from '../../core/interfaces/Query';
import { UserDTO } from '../dtos/UserDTO';
import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';
import { UserMapper } from '../mappers/UserMapper';
import { RoleEnum } from '@eventhub/domain/dist/users/value-objects/Role';

/**
 * Query para obtener usuarios por su rol
 */
export class GetUsersByRoleQuery implements QueryWithoutParams<UserDTO[]> {
  constructor(
    private readonly role: string,
    private readonly userRepository: UserRepositoryAdapter
  ) {}

  /**
   * Ejecuta la query para obtener usuarios por rol
   * @returns Promise<UserDTO[]>
   */
  async execute(): Promise<UserDTO[]> {
    const users = await this.userRepository.findByRole(this.role as RoleEnum);
    return users.map(user => UserMapper.toDTO(user));
  }
} 