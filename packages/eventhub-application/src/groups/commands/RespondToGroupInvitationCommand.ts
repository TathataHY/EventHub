import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, UnauthorizedException } from '../../core/exceptions';
import { GroupInvitationRepository } from '../repositories/GroupInvitationRepository';
import { GroupRepository } from '../repositories/GroupRepository';
import { InvitationStatus, GroupInvitation } from './InviteUserToGroupCommand';
import { SendNotificationCommand } from '../../notifications/commands/SendNotificationCommand';

/**
 * Respuesta posible a una invitación
 */
export enum InvitationResponse {
  ACCEPT = 'accept',
  REJECT = 'reject'
}

/**
 * Comando para responder a una invitación a un grupo
 */
export class RespondToGroupInvitationCommand implements Command<void> {
  constructor(
    private readonly invitationId: string,
    private readonly userId: string,
    private readonly response: InvitationResponse,
    private readonly groupInvitationRepository: GroupInvitationRepository,
    private readonly groupRepository: GroupRepository,
    private readonly sendNotification: SendNotificationCommand
  ) {}

  /**
   * Ejecuta el comando para responder a una invitación de grupo
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si la invitación no existe
   * @throws UnauthorizedException si el usuario no es el destinatario de la invitación
   */
  async execute(): Promise<void> {
    // Validación básica
    if (!this.invitationId) {
      throw new ValidationException('ID de invitación es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    if (!this.response) {
      throw new ValidationException('Respuesta a la invitación es requerida');
    }

    // Obtener la invitación
    const invitation = await this.groupInvitationRepository.findById(this.invitationId);
    if (!invitation) {
      throw new NotFoundException('Invitación', this.invitationId);
    }

    // Verificar que el usuario es el destinatario de la invitación
    if (invitation.userId !== this.userId) {
      throw new UnauthorizedException('No puedes responder a una invitación que no está dirigida a ti');
    }

    // Verificar que la invitación esté pendiente
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ValidationException('Esta invitación ya ha sido respondida o ha expirado');
    }

    // Verificar que la invitación no haya expirado
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      // Actualizar el estado a expirado
      await this.groupInvitationRepository.update({
        ...invitation,
        status: InvitationStatus.EXPIRED,
        updatedAt: new Date()
      });
      throw new ValidationException('Esta invitación ha expirado');
    }

    // Obtener el grupo para verificar su estado
    const group = await this.groupRepository.findById(invitation.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', invitation.groupId);
    }

    // Verificar si el grupo está cerrado
    if (group.isClosed) {
      throw new ValidationException('No puedes unirte a un grupo cerrado');
    }

    // Verificar que no se supere el límite de miembros
    if (this.response === InvitationResponse.ACCEPT && 
        group.members.length >= group.maxMembers) {
      throw new ValidationException(`El grupo ya ha alcanzado su límite de ${group.maxMembers} miembros`);
    }

    // Verificar que el usuario no sea ya miembro del grupo
    const isAlreadyMember = group.members.some(member => member.userId === this.userId);
    if (isAlreadyMember) {
      throw new ValidationException('Ya eres miembro de este grupo');
    }

    // Procesar la respuesta
    if (this.response === InvitationResponse.ACCEPT) {
      // Añadir el usuario al grupo
      group.members.push({
        userId: this.userId,
        role: invitation.role,
        joinedAt: new Date()
      });
      
      await this.groupRepository.update(group);
      
      // Actualizar el estado de la invitación
      await this.groupInvitationRepository.update({
        ...invitation,
        status: InvitationStatus.ACCEPTED,
        updatedAt: new Date()
      });
    } else {
      // Actualizar el estado de la invitación
      await this.groupInvitationRepository.update({
        ...invitation,
        status: InvitationStatus.REJECTED,
        updatedAt: new Date()
      });
    }

    // Enviar notificación al usuario que invitó
    try {
      await this.sendNotification.execute();
    } catch (error) {
      console.error('Error al enviar notificación de respuesta a invitación:', error);
      // No fallamos la operación si la notificación no se envía
    }
  }
} 