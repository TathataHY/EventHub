import { GroupDTO, CreateGroupDTO, UpdateGroupDTO, AddGroupMembersDTO, UpdateGroupMemberRoleDTO, GroupSearchResultDTO } from '../dtos/GroupDTO';
import { CreateGroupCommand } from '../commands/CreateGroupCommand';
import { UpdateGroupCommand } from '../commands/UpdateGroupCommand';
import { DeleteGroupCommand } from '../commands/DeleteGroupCommand';
import { AddGroupMembersCommand } from '../commands/AddGroupMembersCommand';
import { UpdateGroupMemberRoleCommand } from '../commands/UpdateGroupMemberRoleCommand';
import { GetGroupQuery } from '../queries/GetGroupQuery';
import { GetOrganizerGroupsQuery } from '../queries/GetOrganizerGroupsQuery';
import { GetUserGroupsQuery } from '../queries/GetUserGroupsQuery';
import { SearchGroupsQuery } from '../queries/SearchGroupsQuery';
import { GroupRepository } from '../repositories/GroupRepository';
import { GroupMapper } from '../mappers/GroupMapper';

export class GroupService {
  private readonly createGroupCommand: CreateGroupCommand;
  private readonly updateGroupCommand: UpdateGroupCommand;
  private readonly deleteGroupCommand: DeleteGroupCommand;
  private readonly addGroupMembersCommand: AddGroupMembersCommand;
  private readonly updateGroupMemberRoleCommand: UpdateGroupMemberRoleCommand;
  private readonly getGroupQuery: GetGroupQuery;
  private readonly getOrganizerGroupsQuery: GetOrganizerGroupsQuery;
  private readonly getUserGroupsQuery: GetUserGroupsQuery;
  private readonly searchGroupsQuery: SearchGroupsQuery;

  constructor(private readonly groupRepository: GroupRepository) {
    this.createGroupCommand = new CreateGroupCommand(groupRepository);
    this.updateGroupCommand = new UpdateGroupCommand(groupRepository);
    this.deleteGroupCommand = new DeleteGroupCommand(groupRepository);
    this.addGroupMembersCommand = new AddGroupMembersCommand(groupRepository);
    this.updateGroupMemberRoleCommand = new UpdateGroupMemberRoleCommand(groupRepository);
    this.getGroupQuery = new GetGroupQuery(groupRepository);
    this.getOrganizerGroupsQuery = new GetOrganizerGroupsQuery(groupRepository);
    this.getUserGroupsQuery = new GetUserGroupsQuery(groupRepository);
    this.searchGroupsQuery = new SearchGroupsQuery(groupRepository);
  }

  /**
   * Crea un nuevo grupo
   */
  async createGroup(data: CreateGroupDTO): Promise<GroupDTO> {
    const group = await this.createGroupCommand.execute(data);
    return GroupMapper.toDTO(group);
  }

  /**
   * Actualiza un grupo existente
   */
  async updateGroup(id: string, data: UpdateGroupDTO): Promise<GroupDTO> {
    const group = await this.updateGroupCommand.execute({ id, data });
    return GroupMapper.toDTO(group);
  }

  /**
   * Elimina un grupo
   */
  async deleteGroup(id: string): Promise<void> {
    await this.deleteGroupCommand.execute(id);
  }

  /**
   * Agrega miembros a un grupo
   */
  async addGroupMembers(groupId: string, data: AddGroupMembersDTO): Promise<void> {
    await this.addGroupMembersCommand.execute({ groupId, data });
  }

  /**
   * Actualiza el rol de un miembro en un grupo
   */
  async updateGroupMemberRole(groupId: string, data: UpdateGroupMemberRoleDTO): Promise<void> {
    await this.updateGroupMemberRoleCommand.execute({ groupId, data });
  }

  /**
   * Obtiene un grupo por ID
   */
  async getGroup(id: string): Promise<GroupDTO> {
    return this.getGroupQuery.execute(id);
  }

  /**
   * Obtiene los grupos de un organizador
   */
  async getOrganizerGroups(organizerId: string): Promise<GroupDTO[]> {
    return this.getOrganizerGroupsQuery.execute(organizerId);
  }

  /**
   * Obtiene los grupos de un usuario
   */
  async getUserGroups(userId: string): Promise<GroupDTO[]> {
    return this.getUserGroupsQuery.execute(userId);
  }

  /**
   * Busca grupos
   */
  async searchGroups(page: number, limit: number, search?: string): Promise<GroupSearchResultDTO> {
    return this.searchGroupsQuery.execute({ page, limit, search });
  }
} 