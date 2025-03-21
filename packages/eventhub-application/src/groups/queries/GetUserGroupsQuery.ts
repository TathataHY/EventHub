import { GroupRepository } from '../repositories/GroupRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException, ValidationException } from '../../core/exceptions';
import { GroupResult } from './GetGroupByIdQuery';
import { UserRepository } from '../../users/repositories/UserRepository';

/**
 * Filtros para la búsqueda de grupos
 */
export interface UserGroupsFilter {
  /** Incluir solo grupos donde el usuario es administrador */
  onlyAdmin?: boolean;
  /** Incluir solo grupos donde el usuario es moderador */
  onlyModerator?: boolean;
  /** Incluir grupos cerrados */
  includeClosed?: boolean;
  /** Filtrar por nombre de grupo (parcial) */
  name?: string;
  /** Filtrar por etiquetas */
  tags?: string[];
  /** Número máximo de grupos a devolver */
  limit?: number;
  /** Número de grupos a saltar (para paginación) */
  offset?: number;
}

/**
 * Query para obtener los grupos de un usuario
 */
export class GetUserGroupsQuery implements Query<GroupResult[]> {
  constructor(
    private readonly userId: string,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly filter?: UserGroupsFilter
  ) {}

  /**
   * Ejecuta la consulta para obtener los grupos de un usuario
   * @returns Promise<GroupResult[]> Lista de grupos del usuario
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el usuario no existe
   */
  async execute(): Promise<GroupResult[]> {
    // Validación básica
    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    // Configurar filtros con valores por defecto
    const filterOptions = {
      onlyAdmin: this.filter?.onlyAdmin || false,
      onlyModerator: this.filter?.onlyModerator || false,
      includeClosed: this.filter?.includeClosed || false,
      name: this.filter?.name,
      tags: this.filter?.tags,
      limit: this.filter?.limit || 50,
      offset: this.filter?.offset || 0
    };

    // Obtener los grupos del usuario
    const groups = await this.groupRepository.findByUserId(this.userId, filterOptions);

    // Formatear resultados
    return groups.map(group => ({
      ...group,
      membersCount: group.members?.length || 0
    }));
  }
} 