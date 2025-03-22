import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';

export class DeleteGroupCommand implements Command<string, void> {
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Ejecuta el comando para eliminar un grupo
   */
  async execute(id: string): Promise<void> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    await this.groupRepository.delete(id);
  }
} 