import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, UnauthorizedException } from '../../core/exceptions';
import { GroupRole } from './CreateGroupCommand';

/**
 * Comando para cerrar un grupo (eliminación lógica)
 */
export class CloseGroupCommand implements Command<boolean> {
  constructor(
    private readonly groupId: string,
    private readonly userId: string,
    private readonly groupRepository: GroupRepository,
    private readonly reason?: string
  ) {}

  /**
   * Ejecuta el comando para cerrar un grupo
   * @returns Promise<boolean> Resultado de la operación
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<boolean> {
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

    // Verificar si el grupo ya está cerrado
    if (group.isClosed) {
      // El grupo ya está cerrado, consideramos esto como éxito
      return true;
    }

    // Verificar que el usuario tenga permisos para cerrar el grupo
    const userMember = group.members.find(member => member.userId === this.userId);
    if (!userMember) {
      throw new UnauthorizedException('No eres miembro de este grupo');
    }

    // Solo el creador o administradores pueden cerrar grupos
    if (userMember.role !== GroupRole.ADMIN && this.userId !== group.creatorId) {
      throw new UnauthorizedException('No tienes permisos para cerrar este grupo');
    }

    // Actualizar el grupo para marcarlo como cerrado
    const updatedGroup = {
      ...group,
      isClosed: true,
      closedAt: new Date(),
      closedBy: this.userId,
      closeReason: this.reason || 'Grupo cerrado por administrador',
      updatedAt: new Date()
    };

    // Guardar cambios
    const success = await this.groupRepository.update(updatedGroup);

    return success;
  }
} 