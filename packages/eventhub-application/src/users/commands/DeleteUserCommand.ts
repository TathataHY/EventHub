import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';

/**
 * Comando para eliminar un usuario existente
 */
export class DeleteUserCommand implements Command<void> {
  constructor(
    private readonly userId: string,
    private readonly userRepository: UserRepositoryAdapter
  ) {}

  /**
   * Ejecuta el comando para eliminar un usuario
   * @returns Promise<void>
   * @throws NotFoundException si no se encuentra el usuario
   */
  async execute(): Promise<void> {
    // Verificar que el usuario exista usando el adaptador
    const existingUser = await this.userRepository.findUserById(this.userId);
    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${this.userId} no encontrado`);
    }

    // Eliminar el usuario usando el adaptador
    await this.userRepository.deleteUser(this.userId);
  }
} 