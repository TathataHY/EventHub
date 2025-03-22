import { Entity } from '../../core/interfaces/Entity';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enum para el rol de un miembro en un grupo
 */
export enum GroupMemberRole {
  ADMIN = 'ADMIN',    // Puede gestionar el grupo y miembros
  MEMBER = 'MEMBER'   // Miembro regular
}

/**
 * Enum para el estado de un miembro en un grupo
 */
export enum GroupMemberStatus {
  ACTIVE = 'ACTIVE',         // Miembro activo
  INACTIVE = 'INACTIVE',     // Miembro inactivo
  PENDING = 'PENDING',       // Invitación pendiente
  REJECTED = 'REJECTED'      // Invitación rechazada
}

/**
 * Interfaz para las propiedades del miembro de un grupo
 */
export interface GroupMemberProps {
  id: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  status: GroupMemberStatus;
  invitedById?: string;
  joinedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * Entidad de miembro de grupo
 */
export class GroupMember implements Entity<string> {
  /** Identificador único */
  readonly id: string;
  /** ID del grupo */
  readonly groupId: string;
  /** ID del usuario */
  readonly userId: string;
  /** Rol en el grupo */
  private _role: GroupMemberRole;
  /** Estado en el grupo */
  private _status: GroupMemberStatus;
  /** ID de quien envió la invitación */
  readonly invitedById?: string;
  /** Fecha de unión al grupo */
  private _joinedAt?: Date;
  /** Metadatos adicionales */
  private _metadata?: Record<string, any>;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  private _updatedAt: Date;
  /** Indica si está activo */
  readonly isActive: boolean;

  private constructor(props: GroupMemberProps) {
    this.id = props.id;
    this.groupId = props.groupId;
    this.userId = props.userId;
    this._role = props.role;
    this._status = props.status;
    this.invitedById = props.invitedById;
    this._joinedAt = props.joinedAt;
    this._metadata = props.metadata;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this.isActive = props.status !== GroupMemberStatus.INACTIVE;
  }

  /**
   * Crea una nueva instancia de miembro de grupo
   */
  public static create(props: Omit<GroupMemberProps, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): GroupMember {
    if (!props.groupId) {
      throw new Error('El miembro debe estar asociado a un grupo');
    }

    if (!props.userId) {
      throw new Error('El miembro debe ser un usuario');
    }

    const now = new Date();
    
    return new GroupMember({
      id: uuidv4(),
      groupId: props.groupId,
      userId: props.userId,
      role: props.role || GroupMemberRole.MEMBER,
      status: props.status || GroupMemberStatus.ACTIVE,
      invitedById: props.invitedById,
      joinedAt: props.status === GroupMemberStatus.ACTIVE ? (props.joinedAt || now) : undefined,
      metadata: props.metadata,
      createdAt: now,
      updatedAt: now,
      isActive: props.status !== GroupMemberStatus.INACTIVE,
    });
  }

  // Getters
  get role(): GroupMemberRole {
    return this._role;
  }

  get status(): GroupMemberStatus {
    return this._status;
  }

  get joinedAt(): Date | undefined {
    return this._joinedAt;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Cambia el rol del miembro
   */
  changeRole(newRole: GroupMemberRole): void {
    this._role = newRole;
    this._updatedAt = new Date();
  }

  /**
   * Acepta una invitación pendiente
   */
  acceptInvitation(): void {
    if (this._status !== GroupMemberStatus.PENDING) {
      throw new Error('Solo se pueden aceptar invitaciones pendientes');
    }

    this._status = GroupMemberStatus.ACTIVE;
    this._joinedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Rechaza una invitación pendiente
   */
  rejectInvitation(): void {
    if (this._status !== GroupMemberStatus.PENDING) {
      throw new Error('Solo se pueden rechazar invitaciones pendientes');
    }

    this._status = GroupMemberStatus.REJECTED;
    this._updatedAt = new Date();
  }

  /**
   * Desactiva al miembro
   */
  deactivate(): void {
    if (this._status !== GroupMemberStatus.ACTIVE) {
      throw new Error('Solo se pueden desactivar miembros activos');
    }

    this._status = GroupMemberStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  /**
   * Reactiva al miembro
   */
  reactivate(): void {
    if (this._status !== GroupMemberStatus.INACTIVE) {
      throw new Error('Solo se pueden reactivar miembros inactivos');
    }

    this._status = GroupMemberStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza los metadatos del miembro
   */
  updateMetadata(metadata: Record<string, any>): void {
    this._metadata = {
      ...this._metadata,
      ...metadata
    };
    this._updatedAt = new Date();
  }
  
  /**
   * Compara si dos entidades GroupMember son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof GroupMember)) {
      return false;
    }
    
    return this.id === entity.id;
  }
} 