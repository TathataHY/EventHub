import { GroupRepository } from '../repositories/GroupRepository';
import { Command } from '../../core/interfaces/Command';
import { ValidationException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { generateInvitationCode } from '../utils/invitationCodeGenerator';

/**
 * Roles posibles dentro de un grupo
 */
export enum GroupRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member'
}

/**
 * Interfaz para miembro de grupo
 */
export interface GroupMember {
  userId: string;
  role: GroupRole;
  joinedAt: Date;
}

/**
 * Comando para crear un grupo
 */
export class CreateGroupCommand implements Command<string> {
  constructor(
    private readonly name: string,
    private readonly description: string,
    private readonly creatorId: string,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly isPrivate: boolean = false,
    private readonly maxMembers: number = 100,
    private readonly imageUrl?: string,
    private readonly tags?: string[]
  ) {}

  /**
   * Ejecuta el comando para crear un grupo
   * @returns Promise<string> ID del grupo creado
   * @throws ValidationException si hay problemas de validación
   */
  async execute(): Promise<string> {
    // Validación básica
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationException('Nombre de grupo es requerido');
    }

    if (this.name.length > 100) {
      throw new ValidationException('Nombre de grupo no puede exceder 100 caracteres');
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new ValidationException('Descripción del grupo es requerida');
    }

    if (!this.creatorId) {
      throw new ValidationException('ID del creador es requerido');
    }

    // Verificar que el creador existe
    const creator = await this.userRepository.findById(this.creatorId);
    if (!creator) {
      throw new ValidationException(`El usuario con ID ${this.creatorId} no existe`);
    }

    // Crear código de invitación único
    const invitationCode = await this.generateUniqueInvitationCode();

    // Crear miembro inicial (el creador como admin)
    const creatorMember: GroupMember = {
      userId: this.creatorId,
      role: GroupRole.ADMIN,
      joinedAt: new Date()
    };

    // Crear el grupo
    const group = {
      name: this.name.trim(),
      description: this.description.trim(),
      isPrivate: this.isPrivate,
      creatorId: this.creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      maxMembers: this.maxMembers,
      invitationCode,
      imageUrl: this.imageUrl || null,
      members: [creatorMember],
      tags: this.tags || [],
      events: []
    };

    // Guardar el grupo
    const groupId = await this.groupRepository.create(group);

    return groupId;
  }

  /**
   * Genera un código de invitación único verificando que no exista ya
   */
  private async generateUniqueInvitationCode(attempts: number = 0): Promise<string> {
    if (attempts > 5) {
      throw new Error('No se pudo generar un código de invitación único');
    }

    const code = generateInvitationCode();
    const existingGroup = await this.groupRepository.findByInvitationCode(code);

    if (existingGroup) {
      // Si el código ya existe, intentar de nuevo recursivamente
      return this.generateUniqueInvitationCode(attempts + 1);
    }

    return code;
  }
} 