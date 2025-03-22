import { GroupDTO } from '../dtos/GroupDTO';
import { GroupMapper } from '../mappers/GroupMapper';
import { GroupRepository } from '../repositories/GroupRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';

export class GetGroupQuery implements Query<string, GroupDTO> {
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Ejecuta la consulta para obtener un grupo por ID
   */
  async execute(id: string): Promise<GroupDTO> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return GroupMapper.toDTO(group);
  }
} 