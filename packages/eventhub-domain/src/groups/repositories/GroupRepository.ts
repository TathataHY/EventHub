import { Repository } from '../../core/interfaces/Repository';
import { Group } from '../entities/Group';
import { GroupStatus, GroupStatusEnum } from '../value-objects/GroupStatus';
import { GroupMemberRole } from '../value-objects/GroupMemberRole';

/**
 * Opciones para filtrar grupos
 */
export interface FindGroupsOptions {
  eventId?: string;
  createdById?: string;
  name?: string;
  status?: GroupStatus | GroupStatusEnum | string;
  page?: number;
  limit?: number;
  orderBy?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}

/**
 * Interfaz del repositorio de grupos
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para grupos
 */
export interface GroupRepository extends Repository<Group, string> {
  /**
   * Encuentra un grupo por su código de invitación
   * @param code Código de invitación
   * @returns Grupo o null si no existe
   */
  findByInvitationCode(code: string): Promise<Group | null>;
  
  /**
   * Encuentra grupos con opciones de filtrado y paginación
   * @param options Opciones de filtrado y paginación
   * @returns Lista de grupos y el total
   */
  findWithOptions(options: FindGroupsOptions): Promise<{ groups: Group[]; total: number }>;
  
  /**
   * Encuentra grupos por evento
   * @param eventId ID del evento
   * @returns Lista de grupos
   */
  findByEventId(eventId: string): Promise<Group[]>;
  
  /**
   * Encuentra grupos creados por un usuario
   * @param userId ID del usuario
   * @returns Lista de grupos
   */
  findByCreatedById(userId: string): Promise<Group[]>;
  
  /**
   * Busca grupos por nombre (búsqueda parcial)
   * @param query Texto de búsqueda
   * @param eventId ID del evento (opcional)
   * @returns Lista de grupos
   */
  searchByName(query: string, eventId?: string): Promise<Group[]>;
  
  /**
   * Cuenta el número de grupos para un evento
   * @param eventId ID del evento
   * @returns Número de grupos
   */
  countByEventId(eventId: string): Promise<number>;

  /**
   * Busca grupos por ID del organizador
   * @param organizerId ID del organizador
   * @returns Lista de grupos
   */
  findByOrganizerId(organizerId: string): Promise<Group[]>;

  /**
   * Busca grupos por ID de miembro
   * @param userId ID del usuario miembro
   * @returns Lista de grupos
   */
  findByMemberId(userId: string): Promise<Group[]>;

  /**
   * Busca grupos por nombre exacto
   * @param name Nombre del grupo
   * @returns Lista de grupos
   */
  findByName(name: string): Promise<Group[]>;

  /**
   * Verifica si un usuario es miembro de un grupo
   * @param groupId ID del grupo
   * @param userId ID del usuario
   * @returns true si es miembro, false en caso contrario
   */
  isMember(groupId: string, userId: string): Promise<boolean>;

  /**
   * Obtiene el rol de un miembro en un grupo
   * @param groupId ID del grupo
   * @param userId ID del usuario
   * @returns Rol del miembro o null si no es miembro
   */
  getMemberRole(groupId: string, userId: string): Promise<GroupMemberRole | null>;

  /**
   * Agrega miembros a un grupo
   * @param groupId ID del grupo
   * @param userIds IDs de los usuarios a agregar
   * @param role Rol a asignar a los nuevos miembros
   */
  addMembers(groupId: string, userIds: string[], role: GroupMemberRole): Promise<void>;

  /**
   * Elimina miembros de un grupo
   * @param groupId ID del grupo
   * @param userIds IDs de los usuarios a eliminar
   */
  removeMembers(groupId: string, userIds: string[]): Promise<void>;

  /**
   * Actualiza el rol de un miembro en un grupo
   * @param groupId ID del grupo
   * @param userId ID del usuario
   * @param role Nuevo rol a asignar
   */
  updateMemberRole(groupId: string, userId: string, role: GroupMemberRole): Promise<void>;

  /**
   * Obtiene los miembros de un grupo
   * @param groupId ID del grupo
   * @returns Lista de miembros del grupo
   */
  getMembers(groupId: string): Promise<any[]>;

  /**
   * Busca grupos con paginación
   * @param page Número de página
   * @param limit Elementos por página
   * @param search Texto de búsqueda opcional
   * @returns Resultado paginado
   */
  findWithPagination(page: number, limit: number, search?: string): Promise<{
    groups: Group[];
    total: number;
  }>;
} 