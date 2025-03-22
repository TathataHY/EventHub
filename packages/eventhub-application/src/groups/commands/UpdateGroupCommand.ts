import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, UnauthorizedException } from '../../core/exceptions';
import { GroupRole } from './CreateGroupCommand';

/**
 * Comando para actualizar un grupo
 */
export class UpdateGroupCommand implements Command<boolean> {
  constructor(
    private readonly groupId: string,
    private readonly userId: string,
    private readonly groupRepository: GroupRepository,
    private readonly name?: string,
    private readonly description?: string,
    private readonly isPrivate?: boolean,
    private readonly maxMembers?: number,
    private readonly imageUrl?: string,
    private readonly tags?: string[]
  ) {}

  /**
   * Ejecuta el comando para actualizar un grupo
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

    if (this.name && this.name.length > 100) {
      throw new ValidationException('Nombre de grupo no puede exceder 100 caracteres');
    }

    // Verificar si hay al menos un campo para actualizar
    if (!this.name && !this.description && this.isPrivate === undefined && 
        !this.maxMembers && !this.imageUrl && !this.tags) {
      throw new ValidationException('Se debe proporcionar al menos un campo para actualizar');
    }

    // Obtener el grupo
    const group = await this.groupRepository.findById(this.groupId);
    if (!group) {
      throw new NotFoundException('Grupo', this.groupId);
    }

    // Verificar que el usuario tenga permisos para actualizar el grupo
    const userMember = group.members.find(member => member.userId === this.userId);
    if (!userMember) {
      throw new UnauthorizedException('No eres miembro de este grupo');
    }

    // Solo administradores y moderadores pueden actualizar grupos
    if (userMember.role !== GroupRole.ADMIN && userMember.role !== GroupRole.MODERATOR) {
      throw new UnauthorizedException('No tienes permisos para actualizar este grupo');
    }

    // Los moderadores no pueden cambiar ciertas propiedades
    if (userMember.role === GroupRole.MODERATOR && 
        (this.isPrivate !== undefined || this.maxMembers !== undefined)) {
      throw new UnauthorizedException(
        'Los moderadores no pueden cambiar la privacidad o el número máximo de miembros'
      );
    }

    // Actualizar los campos proporcionados
    const updatedGroup = {
      ...group,
      updatedAt: new Date()
    };

    if (this.name) {
      updatedGroup.name = this.name.trim();
    }

    if (this.description) {
      updatedGroup.description = this.description.trim();
    }

    if (this.isPrivate !== undefined) {
      updatedGroup.isPrivate = this.isPrivate;
    }

    if (this.maxMembers !== undefined) {
      // Comprobar que el nuevo límite no sea menor que el número actual de miembros
      if (this.maxMembers < updatedGroup.members.length) {
        throw new ValidationException(
          `El máximo de miembros no puede ser menor que el número actual (${updatedGroup.members.length})`
        );
      }
      updatedGroup.maxMembers = this.maxMembers;
    }

    if (this.imageUrl !== undefined) {
      updatedGroup.imageUrl = this.imageUrl || null;
    }

    if (this.tags) {
      updatedGroup.tags = this.tags;
    }

    // Guardar cambios
    const success = await this.groupRepository.update(updatedGroup);

    return success;
  }
} 