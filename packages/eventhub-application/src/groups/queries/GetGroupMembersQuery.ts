import { GroupRepository } from '../repositories/GroupRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException, ValidationException, UnauthorizedException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { GroupMember, GroupRole } from '../commands/CreateGroupCommand';

/**
 * Filtros para la búsqueda de miembros
 */
export interface GroupMembersFilter {
  /** Filtrar por rol */
  role?: GroupRole;
  /** Filtrar por texto (nombre o email) */
  searchText?: string;
  /** Número máximo de miembros a devolver */
  limit?: number;
  /** Número de miembros a saltar (para paginación) */
  offset?: number;
}

/**
 * Interfaz para resultado de miembro de grupo
 */
export interface GroupMemberResult extends GroupMember {
  name: string;
  email: string;
  profileImageUrl?: string;
}

/**
 * Query para obtener los miembros de un grupo
 */
export class GetGroupMembersQuery implements Query<GroupMemberResult[]> {
  constructor(
    private readonly groupId: string,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly currentUserId?: string,
    private readonly filter?: GroupMembersFilter
  ) {}

  /**
   * Ejecuta la consulta para obtener los miembros de un grupo
   * @returns Promise<GroupMemberResult[]> Lista de miembros del grupo
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo no existe
   * @throws UnauthorizedException si el usuario no tiene permisos para ver el grupo
   */
  async execute(): Promise<GroupMemberResult[]> {
    // Validación básica
    if (!this.groupId) {
      throw new ValidationException('ID de grupo es requerido');
    }

    // Obtener el grupo
    const group = await this.groupRepository.findById(this.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', this.groupId);
    }

    // Verificar acceso si el grupo es privado y hay un usuario actual
    if (group.isPrivate && this.currentUserId) {
      const isMember = this.checkUserIsMember(group.members, this.currentUserId);
      if (!isMember) {
        throw new UnauthorizedException('No tienes permiso para ver los miembros de este grupo privado');
      }
    }

    // Aplicar filtros
    let members = [...group.members];

    // Filtrar por rol
    if (this.filter?.role) {
      members = members.filter(member => member.role === this.filter?.role);
    }

    // Aplicar paginación
    const limit = this.filter?.limit || 50;
    const offset = this.filter?.offset || 0;

    if (offset > 0) {
      members = members.slice(offset);
    }

    if (members.length > limit) {
      members = members.slice(0, limit);
    }

    // Obtener información adicional de los usuarios
    const userIds = members.map(member => member.userId);
    const users = await this.userRepository.findByIds(userIds);

    // Combinar la información de miembros y usuarios
    const result = members.map(member => {
      const user = users.find(u => u.id === member.userId);
      
      if (!user) {
        // Si no se encuentra el usuario, devolver solo la información del miembro
        return {
          ...member,
          name: 'Usuario Desconocido',
          email: ''
        };
      }

      // Aplicar filtro de texto si está presente
      if (this.filter?.searchText && this.filter.searchText.trim()) {
        const searchText = this.filter.searchText.toLowerCase();
        const userName = user.name?.toLowerCase() || '';
        const userEmail = user.email?.toLowerCase() || '';
        
        if (!userName.includes(searchText) && !userEmail.includes(searchText)) {
          return null;
        }
      }

      // Combinar información
      return {
        ...member,
        name: user.name || 'Sin Nombre',
        email: user.email || '',
        profileImageUrl: user.profileImageUrl
      };
    }).filter(Boolean) as GroupMemberResult[];

    return result;
  }

  /**
   * Verifica si un usuario es miembro del grupo
   */
  private checkUserIsMember(members: GroupMember[], userId: string): boolean {
    return members.some(member => member.userId === userId);
  }
} 