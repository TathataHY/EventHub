import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, UnauthorizedException, ConflictException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { GroupRole } from './CreateGroupCommand';
import { SendNotificationCommand } from '../../notifications/commands/SendNotificationCommand';

/**
 * Comando para cambiar el rol de un miembro en un grupo
 */
export class ChangeGroupMemberRoleCommand implements Command<void> {
  constructor(
    private readonly groupId: string,
    private readonly targetUserId: string,
    private readonly userId: string,
    private readonly newRole: GroupRole,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly sendNotification: SendNotificationCommand
  ) {}

  /**
   * Ejecuta el comando para cambiar el rol de un miembro en un grupo
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo o usuario no existen
   * @throws UnauthorizedException si el usuario no tiene permisos
   * @throws ConflictException si el usuario destino es el único administrador
   */
  async execute(): Promise<void> {
    // Validación básica
    if (!this.groupId) {
      throw new ValidationException('ID de grupo es requerido');
    }

    if (!this.targetUserId) {
      throw new ValidationException('ID de usuario objetivo es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    if (!this.newRole) {
      throw new ValidationException('Nuevo rol es requerido');
    }

    if (!Object.values(GroupRole).includes(this.newRole)) {
      throw new ValidationException(`Rol '${this.newRole}' no es válido`);
    }

    // Obtener el grupo
    const group = await this.groupRepository.findById(this.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', this.groupId);
    }

    // Verificar si el grupo está cerrado
    if (group.isClosed) {
      throw new ValidationException('No se pueden modificar roles en un grupo cerrado');
    }

    // Verificar que el usuario destino exista en la plataforma
    const targetUser = await this.userRepository.findById(this.targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Usuario', this.targetUserId);
    }

    // Verificar que el usuario ejecutor tenga permisos
    const userMember = group.members.find(member => member.userId === this.userId);
    if (!userMember) {
      throw new UnauthorizedException('No eres miembro de este grupo');
    }

    // Solo los administradores pueden cambiar roles
    if (userMember.role !== GroupRole.ADMIN) {
      throw new UnauthorizedException('Solo los administradores pueden cambiar roles');
    }

    // Verificar que el usuario destino sea miembro del grupo
    const targetMember = group.members.find(member => member.userId === this.targetUserId);
    if (!targetMember) {
      throw new NotFoundException('Miembro', this.targetUserId);
    }

    // No permitir cambiar el rol del único administrador
    if (targetMember.role === GroupRole.ADMIN && this.newRole !== GroupRole.ADMIN) {
      const adminCount = group.members.filter(member => member.role === GroupRole.ADMIN).length;
      if (adminCount <= 1) {
        throw new ConflictException('No se puede degradar al único administrador del grupo');
      }
    }

    // Si el usuario intenta cambiar su propio rol de admin a otro, verificar que no sea el único admin
    if (this.userId === this.targetUserId && 
        userMember.role === GroupRole.ADMIN && 
        this.newRole !== GroupRole.ADMIN) {
      const adminCount = group.members.filter(member => member.role === GroupRole.ADMIN).length;
      if (adminCount <= 1) {
        throw new ConflictException('No puedes degradarte siendo el único administrador del grupo');
      }
    }

    // Cambiar el rol
    targetMember.role = this.newRole;
    await this.groupRepository.update(group);

    // Enviar notificación al usuario cuyo rol fue cambiado
    try {
      if (this.userId !== this.targetUserId) {
        await this.sendNotification.execute();
      }
    } catch (error) {
      console.error('Error al enviar notificación de cambio de rol:', error);
      // No fallamos la operación si la notificación no se envía
    }
  }
} 