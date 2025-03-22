import { Query } from '../../core/interfaces/Query';
import { NotFoundException, ValidationException, UnauthorizedException } from '../../core/exceptions';
import { GroupInvitationRepository } from '../repositories/GroupInvitationRepository';
import { GroupRepository } from '../repositories/GroupRepository';
import { UserRepository } from '../../users/repositories/UserRepository';
import { GroupInvitation, InvitationStatus } from '../commands/InviteUserToGroupCommand';
import { GroupRole } from '../commands/CreateGroupCommand';

/**
 * Filtros para buscar invitaciones de grupo
 */
export interface InvitationFilter {
  status?: InvitationStatus;
  limit?: number;
  offset?: number;
}

/**
 * Resultado de una invitación con información adicional
 */
export interface InvitationResult extends GroupInvitation {
  targetUserName?: string;
  targetUserEmail?: string;
  inviterName?: string;
  groupName?: string;
}

/**
 * Consulta para obtener invitaciones pendientes a un grupo
 */
export class GetPendingGroupInvitationsQuery implements Query<InvitationResult[]> {
  constructor(
    private readonly groupId: string,
    private readonly userId: string,
    private readonly groupInvitationRepository: GroupInvitationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly filter: InvitationFilter = {}
  ) {}

  /**
   * Ejecuta la consulta para obtener invitaciones pendientes
   * @returns Promise<InvitationResult[]> Lista de invitaciones
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<InvitationResult[]> {
    // Validación básica
    if (!this.groupId) {
      throw new ValidationException('ID de grupo es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    // Obtener el grupo
    const group = await this.groupRepository.findById(this.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', this.groupId);
    }

    // Verificar que el usuario tenga permisos
    const userMember = group.members.find(member => member.userId === this.userId);
    if (!userMember) {
      throw new UnauthorizedException('No eres miembro de este grupo');
    }

    // Solo administradores y moderadores pueden ver invitaciones pendientes
    const canViewInvitations = userMember.role === GroupRole.ADMIN || userMember.role === GroupRole.MODERATOR;
    if (!canViewInvitations) {
      throw new UnauthorizedException('No tienes permisos para ver las invitaciones pendientes de este grupo');
    }

    // Configurar filtros
    const status = this.filter.status || InvitationStatus.PENDING;
    const limit = this.filter.limit || 20;
    const offset = this.filter.offset || 0;

    // Obtener invitaciones filtradas
    const invitations = await this.groupInvitationRepository.findByGroupId(
      this.groupId, 
      { status, limit, offset }
    );

    // Si no hay invitaciones, retornar lista vacía
    if (invitations.length === 0) {
      return [];
    }

    // Obtener información adicional de los usuarios para enriquecer los resultados
    const enrichedInvitations: InvitationResult[] = await Promise.all(
      invitations.map(async (invitation): Promise<InvitationResult> => {
        // Obtenemos información del usuario invitado
        let targetUserName: string | undefined;
        let targetUserEmail: string | undefined;
        
        try {
          const targetUser = await this.userRepository.findById(invitation.userId);
          if (targetUser) {
            targetUserName = targetUser.name;
            targetUserEmail = targetUser.email;
          }
        } catch (error) {
          console.error(`Error al obtener información del usuario ${invitation.userId}:`, error);
        }

        // Obtenemos información del usuario que invitó
        let inviterName: string | undefined;
        
        try {
          const inviter = await this.userRepository.findById(invitation.invitedBy);
          if (inviter) {
            inviterName = inviter.name;
          }
        } catch (error) {
          console.error(`Error al obtener información del invitador ${invitation.invitedBy}:`, error);
        }

        return {
          ...invitation,
          targetUserName,
          targetUserEmail,
          inviterName,
          groupName: group.name
        };
      })
    );

    return enrichedInvitations;
  }
} 