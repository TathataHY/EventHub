import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';
import { CreateUserCommand } from '../commands/CreateUserCommand';
import { UpdateUserCommand } from '../commands/UpdateUserCommand';
import { DeleteUserCommand } from '../commands/DeleteUserCommand';
import { GetUserByIdQuery } from '../queries/GetUserByIdQuery';
import { GetUserByEmailQuery } from '../queries/GetUserByEmailQuery';
import { GetUsersByRoleQuery } from '../queries/GetUsersByRoleQuery';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { UserDTO } from '../dtos/UserDTO';
import { UserMapper } from '../mappers/UserMapper';

/**
 * Servicio que coordina todas las operaciones relacionadas con usuarios
 */
export class UserService {
  private userMapper = new UserMapper();
  
  constructor(private readonly userRepository: UserRepositoryAdapter) {}

  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   */
  async createUser(userData: CreateUserDTO): Promise<void> {
    const command = new CreateUserCommand(this.userRepository, this.userMapper, userData);
    await command.execute();
  }

  /**
   * Actualiza un usuario existente
   * @param userId ID del usuario a actualizar
   * @param userData Datos a actualizar
   */
  async updateUser(userId: string, userData: UpdateUserDTO): Promise<void> {
    const command = new UpdateUserCommand(userId, userData, this.userRepository);
    await command.execute();
  }

  /**
   * Elimina un usuario existente
   * @param userId ID del usuario a eliminar
   */
  async deleteUser(userId: string): Promise<void> {
    const command = new DeleteUserCommand(userId, this.userRepository);
    await command.execute();
  }

  /**
   * Obtiene un usuario por su ID
   * @param userId ID del usuario a buscar
   * @returns Datos del usuario
   */
  async getUserById(userId: string): Promise<UserDTO> {
    const query = new GetUserByIdQuery(userId, this.userRepository);
    return query.execute();
  }

  /**
   * Obtiene un usuario por su email
   * @param email Email del usuario a buscar
   * @returns Datos del usuario o null si no se encuentra
   */
  async getUserByEmail(email: string): Promise<UserDTO | null> {
    const query = new GetUserByEmailQuery(email, this.userRepository);
    return query.execute();
  }

  /**
   * Obtiene usuarios por su rol
   * @param role Rol de los usuarios a buscar
   * @returns Lista de usuarios con el rol especificado
   */
  async getUsersByRole(role: string): Promise<UserDTO[]> {
    const query = new GetUsersByRoleQuery(role, this.userRepository);
    return query.execute();
  }

  /**
   * Cuenta usuarios por su rol
   * @param role Rol a contar
   * @returns Número de usuarios con el rol especificado
   */
  async countUsersByRole(role: string): Promise<number> {
    return this.userRepository.countByRole(role);
  }

  /**
   * Cuenta usuarios activos desde una fecha específica
   * @param since Fecha desde la que contar
   * @returns Número de usuarios activos
   */
  async countActiveUsers(since?: Date): Promise<number> {
    return this.userRepository.countActiveUsers(since);
  }

  /**
   * Obtiene estadísticas de usuarios por día
   * @param since Fecha desde la que obtener estadísticas
   * @returns Estadísticas de usuarios por día
   */
  async getUsersPerDay(since?: Date): Promise<{ date: string; count: number }[]> {
    return this.userRepository.getUsersPerDay(since);
  }
} 