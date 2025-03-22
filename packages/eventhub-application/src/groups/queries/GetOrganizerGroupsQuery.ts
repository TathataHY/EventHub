import { GroupDTO } from '../dtos/GroupDTO';
import { GroupMapper } from '../mappers/GroupMapper';
import { GroupRepository } from '../repositories/GroupRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

export class GetOrganizerGroupsQuery implements Query<string, GroupDTO[]> {
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Ejecuta la consulta para obtener los grupos de un organizador
   */
  async execute(organizerId: string): Promise<GroupDTO[]> {
    if (!organizerId) {
      throw new Error('El ID del organizador es requerido');
    }

    const groups = await this.groupRepository.findByOrganizerId(organizerId);
    return GroupMapper.toDTOList(groups);
  }
} 