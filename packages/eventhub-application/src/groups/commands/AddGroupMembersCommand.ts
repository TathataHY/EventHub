import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';
import { AddGroupMembersDTO, GroupMemberRole } from '../dtos/GroupDTO';

export class AddGroupMembersCommand implements Command<{ groupId: string; data: AddGroupMembersDTO }, void> {
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Ejecuta el comando para agregar miembros a un grupo
   */
  async execute({ groupId, data }: { groupId: string; data: AddGroupMembersDTO }): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    if (!data.userIds || data.userIds.length === 0) {
      throw new Error('Debe proporcionar al menos un ID de usuario');
    }

    const role = data.role || GroupMemberRole.MEMBER;
    await this.groupRepository.addMembers(groupId, data.userIds, role);
  }
} 