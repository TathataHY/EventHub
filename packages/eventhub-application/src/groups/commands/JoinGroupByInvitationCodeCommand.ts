import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, ConflictException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { GroupRole } from './CreateGroupCommand';
import { SendNotificationCommand } from '../../notifications/commands/SendNotificationCommand';

/**
 * Comando para unirse a un grupo mediante código de invitación
 */
export class JoinGroupByInvitationCodeCommand implements Command<void> {
  constructor(
    private readonly invitationCode: string,
    private readonly userId: string,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly sendNotification: SendNotificationCommand
  ) {}

  /**
   * Ejecuta el comando para unirse a un grupo con código de invitación
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo o usuario no existen
   * @throws ConflictException si el usuario ya es miembro
   */
  async execute(): Promise<void> {
    // Validación básica
    if (!this.invitationCode) {
      throw new ValidationException('Código de invitación es requerido');
    }

    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    // Buscar el grupo con el código de invitación
    const group = await this.groupRepository.findByInvitationCode(this.invitationCode);
    if (!group) {
      throw new NotFoundException('Grupo con código de invitación', this.invitationCode);
    }

    // Verificar si el grupo está cerrado
    if (group.isClosed) {
      throw new ValidationException('No puedes unirte a un grupo cerrado');
    }

    // Verificar si el grupo es privado
    if (group.isPrivate) {
      throw new ValidationException('No puedes unirte a un grupo privado con un código, requieres una invitación personal');
    }

    // Verificar que el usuario no sea ya miembro del grupo
    const isAlreadyMember = group.members.some(member => member.userId === this.userId);
    if (isAlreadyMember) {
      throw new ConflictException('Ya eres miembro de este grupo');
    }

    // Verificar que no se supere el límite de miembros
    if (group.members.length >= group.maxMembers) {
      throw new ValidationException(`El grupo ya ha alcanzado su límite de ${group.maxMembers} miembros`);
    }

    // Añadir el usuario como miembro del grupo
    const newMember = {
      userId: this.userId,
      role: GroupRole.MEMBER,
      joinedAt: new Date()
    };

    // Actualizar el grupo con el nuevo miembro
    group.members.push(newMember);
    await this.groupRepository.update(group);

    // Enviar notificación a los administradores del grupo
    try {
      const adminMembers = group.members.filter(
        member => member.role === GroupRole.ADMIN
      );

      // Enviar notificaciones a cada administrador (podríamos mejorar con un bulk de notificaciones)
      for (const admin of adminMembers) {
        if (admin.userId !== this.userId) {
          await this.sendNotification.execute();
        }
      }
    } catch (error) {
      console.error('Error al enviar notificación de unión al grupo:', error);
      // No fallamos la operación si la notificación no se envía
    }
  }
} 