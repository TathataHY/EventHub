import { GroupRepository } from '../repositories/GroupRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException, ValidationException } from '../../core/exceptions';
import { GroupMember, GroupRole } from '../commands/CreateGroupCommand';

/**
 * Interfaz para resultado de grupo
 */
export interface GroupResult {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  maxMembers: number;
  invitationCode: string;
  imageUrl?: string;
  members: GroupMember[];
  membersCount: number;
  tags: string[];
  events: string[];
}

/**
 * Query para obtener un grupo por su ID
 */
export class GetGroupByIdQuery implements Query<GroupResult> {
  constructor(
    private readonly groupId: string,
    private readonly groupRepository: GroupRepository,
    private readonly currentUserId?: string
  ) {}

  /**
   * Ejecuta la consulta para obtener un grupo por su ID
   * @returns Promise<GroupResult> Datos del grupo
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo no existe
   */
  async execute(): Promise<GroupResult> {
    // Validación básica
    if (!this.groupId) {
      throw new ValidationException('ID de grupo es requerido');
    }

    // Obtener el grupo
    const group = await this.groupRepository.findById(this.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', this.groupId);
    }

    // Verificar acceso si el grupo es privado
    if (group.isPrivate && this.currentUserId) {
      const isMember = this.checkUserIsMember(group.members, this.currentUserId);
      if (!isMember) {
        throw new ValidationException('No tienes permiso para ver este grupo privado');
      }
    }

    // Contar miembros
    const membersCount = group.members?.length || 0;

    // Mapear resultado
    return {
      ...group,
      membersCount
    };
  }

  /**
   * Verifica si un usuario es miembro del grupo
   */
  private checkUserIsMember(members: GroupMember[], userId: string): boolean {
    return members.some(member => member.userId === userId);
  }
} 