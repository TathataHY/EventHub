// Re-exportamos las interfaces de dominio
export { 
  GroupRepository,
  FindGroupsOptions
} from '../../../eventhub-domain/src/groups/repositories/GroupRepository';

// DTOs
export * from './dtos/GroupDTO';
export * from './dtos/CreateGroupDTO';
export * from './dtos/UpdateGroupDTO';

// Commands
export * from './commands/CreateGroupCommand';
export * from './commands/UpdateGroupCommand';
export * from './commands/DeleteGroupCommand';
export * from './commands/AddGroupMemberCommand';
export * from './commands/RemoveGroupMemberCommand';
export * from './commands/UpdateGroupMemberRoleCommand';

// Queries
export * from './queries/GetGroupByIdQuery';
export * from './queries/GetGroupsByEventQuery';
export * from './queries/GetGroupsByOrganizerQuery';
export * from './queries/SearchGroupsQuery';

// Mappers
export * from './mappers/GroupMapper';

// Services
export * from './services/GroupService'; 