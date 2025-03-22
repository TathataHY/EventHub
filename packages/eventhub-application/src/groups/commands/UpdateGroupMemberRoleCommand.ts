import { GroupRepository } from '@eventhub/domain/dist/groups/repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { UpdateGroupMemberRoleDTO } from '../dtos/GroupDTO';

export class UpdateGroupMemberRoleCommand implements Command<{ groupId: string; data: UpdateGroupMemberRoleDTO }, void> {
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Ejecuta el comando para actualizar el rol de un miembro en un grupo
   */
  async execute({ groupId, data }: { groupId: string; data: UpdateGroupMemberRoleDTO }): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    const isMember = await this.groupRepository.isMember(groupId, data.userId);
    if (!isMember) {
      throw new NotFoundException(`Usuario con ID ${data.userId} no es miembro del grupo`);
    }

    await this.groupRepository.updateMemberRole(groupId, data.userId, data.role);
  }
} 