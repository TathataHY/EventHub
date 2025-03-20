import { Repository } from '../../core/interfaces/Repository';
import { Group } from '../entities/Group';
import { GroupStatus, GroupStatusEnum } from '../value-objects/GroupStatus';

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
} 