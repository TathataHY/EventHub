import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, UnauthorizedException } from '../../core/exceptions';
import { GroupRole } from './CreateGroupCommand';
import { randomUUID } from 'crypto';

/**
 * Comando para regenerar el código de invitación de un grupo
 */
export class RegenerateInvitationCodeCommand implements Command<string> {
  constructor(
    private readonly groupId: string,
    private readonly userId: string,
    private readonly groupRepository: GroupRepository
  ) {}

  /**
   * Ejecuta el comando para regenerar el código de invitación
   * @returns Promise<string> Nuevo código de invitación
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el grupo no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<string> {
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

    // Verificar si el grupo está cerrado
    if (group.isClosed) {
      throw new ValidationException('No se puede regenerar el código de invitación para un grupo cerrado');
    }

    // Verificar que el usuario tenga permisos para regenerar el código
    const userMember = group.members.find(member => member.userId === this.userId);
    if (!userMember) {
      throw new UnauthorizedException('No eres miembro de este grupo');
    }

    // Solo administradores y moderadores pueden regenerar el código
    const canRegenerateCode = userMember.role === GroupRole.ADMIN || userMember.role === GroupRole.MODERATOR;
    if (!canRegenerateCode) {
      throw new UnauthorizedException('No tienes permisos para regenerar el código de invitación de este grupo');
    }

    // Si el grupo es privado, no debería tener código de invitación
    if (group.isPrivate) {
      throw new ValidationException('Los grupos privados no utilizan códigos de invitación');
    }

    // Generar nuevo código de invitación (simplificado para el ejemplo)
    // En una implementación real, se podría usar un algoritmo más específico para generar códigos más cortos y legibles
    const newInvitationCode = randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();

    // Actualizar el grupo con el nuevo código
    group.invitationCode = newInvitationCode;
    group.updatedAt = new Date();
    
    // Guardar el grupo
    await this.groupRepository.update(group);

    return newInvitationCode;
  }
} 