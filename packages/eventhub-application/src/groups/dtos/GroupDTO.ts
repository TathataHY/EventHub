/**
 * DTO para representar un grupo
 */
export interface GroupDTO {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  members: GroupMemberDTO[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para representar un miembro de un grupo
 */
export interface GroupMemberDTO {
  userId: string;
  role: GroupMemberRole;
  joinedAt: Date;
}

/**
 * Roles posibles para miembros de un grupo
 */
export enum GroupMemberRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER'
}

/**
 * DTO para crear un nuevo grupo
 */
export interface CreateGroupDTO {
  name: string;
  description: string;
  organizerId: string;
  initialMembers?: string[]; // IDs de usuarios
}

/**
 * DTO para actualizar un grupo existente
 */
export interface UpdateGroupDTO {
  name?: string;
  description?: string;
}

/**
 * DTO para agregar miembros a un grupo
 */
export interface AddGroupMembersDTO {
  userIds: string[];
  role?: GroupMemberRole;
}

/**
 * DTO para actualizar el rol de un miembro
 */
export interface UpdateGroupMemberRoleDTO {
  userId: string;
  role: GroupMemberRole;
}

/**
 * DTO para la respuesta de búsqueda de grupos
 */
export interface GroupSearchResultDTO {
  groups: GroupDTO[];
  total: number;
  page: number;
  limit: number;
} 