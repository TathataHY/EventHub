import { Repository } from '../../../core/interfaces/Repository';
import { GroupMember } from '../entities/GroupMember';
import { GroupMemberRole, GroupMemberRoleEnum } from '../value-objects/GroupMemberRole';
import { GroupMemberStatus, GroupMemberStatusEnum } from '../value-objects/GroupMemberStatus';

/**
 * Opciones para filtrar miembros de grupo
 */
export interface FindGroupMembersOptions {
  groupId?: string;
  userId?: string;
  status?: GroupMemberStatus | GroupMemberStatusEnum | string;
  role?: GroupMemberRole | GroupMemberRoleEnum | string;
  page?: number;
  limit?: number;
  orderBy?: 'createdAt' | 'joinedAt';
  order?: 'asc' | 'desc';
}

/**
 * Interfaz del repositorio de miembros de grupo
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para miembros de grupo
 */
export interface GroupMemberRepository extends Repository<GroupMember, string> {
  /**
   * Encuentra un miembro por grupo y usuario
   * @param groupId ID del grupo
   * @param userId ID del usuario
   * @returns Miembro o null si no existe
   */
  findByGroupIdAndUserId(groupId: string, userId: string): Promise<GroupMember | null>;
  
  /**
   * Encuentra miembros con opciones de filtrado y paginación
   * @param options Opciones de filtrado y paginación
   * @returns Lista de miembros y el total
   */
  findWithOptions(options: FindGroupMembersOptions): Promise<{ members: GroupMember[]; total: number }>;
  
  /**
   * Encuentra miembros por grupo
   * @param groupId ID del grupo
   * @returns Lista de miembros
   */
  findByGroupId(groupId: string): Promise<GroupMember[]>;
  
  /**
   * Encuentra grupos a los que pertenece un usuario
   * @param userId ID del usuario
   * @param status Estado del miembro (opcional)
   * @returns Lista de miembros
   */
  findByUserId(userId: string, status?: GroupMemberStatus | GroupMemberStatusEnum | string): Promise<GroupMember[]>;
  
  /**
   * Encuentra miembros administradores de un grupo
   * @param groupId ID del grupo
   * @returns Lista de miembros administradores
   */
  findAdminsByGroupId(groupId: string): Promise<GroupMember[]>;
  
  /**
   * Encuentra invitaciones pendientes para un usuario
   * @param userId ID del usuario
   * @returns Lista de invitaciones pendientes
   */
  findPendingInvitationsByUserId(userId: string): Promise<GroupMember[]>;
  
  /**
   * Elimina todos los miembros de un grupo
   * @param groupId ID del grupo
   * @returns Número de miembros eliminados
   */
  deleteByGroupId(groupId: string): Promise<number>;
  
  /**
   * Cuenta el número de miembros en un grupo
   * @param groupId ID del grupo
   * @param status Estado de los miembros (opcional)
   * @returns Número de miembros
   */
  countByGroupId(
    groupId: string, 
    status?: GroupMemberStatus | GroupMemberStatusEnum | string
  ): Promise<number>;
  
  /**
   * Verifica si un usuario es administrador de un grupo
   * @param groupId ID del grupo
   * @param userId ID del usuario
   * @returns true si es administrador, false en caso contrario
   */
  isAdmin(groupId: string, userId: string): Promise<boolean>;
} 