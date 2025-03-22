import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, UnauthorizedException, ConflictException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { GroupRole } from './CreateGroupCommand';
import { GroupInvitationRepository } from '../repositories/GroupInvitationRepository';
import { NotificationType } from '../../notifications/commands/CreateNotificationCommand';
import { SendNotificationCommand } from '../../notifications/commands/SendNotificationCommand';

/**
 * Estado de una invitación a grupo
 */
export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

/**
 * Interfaz para invitación a grupo
 */
export interface GroupInvitation {
  id?: string;
  groupId: string;
  userId: string;
  invitedBy: string;
  role: GroupRole;
  status: InvitationStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Comando para invitar a un usuario a un grupo
 */
export class InviteUserToGroupCommand implements Command<string> {
  constructor(
    private readonly groupId: string,
    private readonly userId: string,
    private readonly targetUserId: string,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly groupInvitationRepository: GroupInvitationRepository,
    private readonly sendNotification: SendNotificationCommand,
    private readonly role: GroupRole = GroupRole.MEMBER,
    private readonly message?: string,
    private readonly expirationDays: number = 7
  ) {}

  /**
   * Ejecuta el comando para invitar a un usuario a un grupo
   * @returns Promise<string> ID de la invitación creada
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo o usuario no existen
   * @throws UnauthorizedException si el usuario no tiene permisos
   * @throws ConflictException si ya existe una invitación pendiente o el usuario ya es miembro
   */
  async execute(): Promise<string> {
    // Validación básica
    if (!this.groupId) {
      throw new ValidationException('ID de grupo es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    if (!this.targetUserId) {
      throw new ValidationException('ID de usuario invitado es requerido');
    }

    // Obtener el grupo
    const group = await this.groupRepository.findById(this.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', this.groupId);
    }

    // Verificar si el grupo está cerrado
    if (group.isClosed) {
      throw new ValidationException('No se pueden enviar invitaciones a un grupo cerrado');
    }

    // Verificar que el usuario tenga permisos para invitar
    const userMember = group.members.find(member => member.userId === this.userId);
    if (!userMember) {
      throw new UnauthorizedException('No eres miembro de este grupo');
    }

    // Solo administradores y moderadores pueden invitar usuarios
    const canInvite = userMember.role === GroupRole.ADMIN || userMember.role === GroupRole.MODERATOR;
    if (!canInvite) {
      throw new UnauthorizedException('No tienes permisos para invitar usuarios a este grupo');
    }

    // Verificar que solo los administradores puedan añadir moderadores o administradores
    if ((this.role === GroupRole.ADMIN || this.role === GroupRole.MODERATOR) && 
        userMember.role !== GroupRole.ADMIN) {
      throw new UnauthorizedException('Solo los administradores pueden invitar como moderadores o administradores');
    }

    // Verificar que el usuario a invitar existe
    const targetUser = await this.userRepository.findById(this.targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Usuario', this.targetUserId);
    }

    // Verificar que el usuario no sea ya miembro del grupo
    const isAlreadyMember = group.members.some(member => member.userId === this.targetUserId);
    if (isAlreadyMember) {
      throw new ConflictException('El usuario ya es miembro del grupo');
    }

    // Verificar que no exista una invitación pendiente
    const existingInvitation = await this.groupInvitationRepository.findPendingInvitation(
      this.groupId,
      this.targetUserId
    );

    if (existingInvitation) {
      throw new ConflictException('Ya existe una invitación pendiente para este usuario');
    }

    // Verificar que no se supere el límite de miembros
    if (group.members.length >= group.maxMembers) {
      throw new ValidationException(`El grupo ya ha alcanzado su límite de ${group.maxMembers} miembros`);
    }

    // Crear fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.expirationDays);

    // Crear la invitación
    const invitation: GroupInvitation = {
      groupId: this.groupId,
      userId: this.targetUserId,
      invitedBy: this.userId,
      role: this.role,
      status: InvitationStatus.PENDING,
      message: this.message,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt
    };

    // Guardar la invitación
    const invitationId = await this.groupInvitationRepository.create(invitation);

    // Enviar notificación al usuario invitado
    try {
      await this.sendNotification.execute();
    } catch (error) {
      console.error('Error al enviar notificación de invitación:', error);
      // No fallamos la operación si la notificación no se envía
    }

    return invitationId;
  }
} 