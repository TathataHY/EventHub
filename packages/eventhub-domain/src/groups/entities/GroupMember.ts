import { Entity } from './Entity';

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
  id?: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  status: GroupMemberStatus;
  invitedById?: string;
  joinedAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidad de miembro de grupo
 */
export class GroupMember extends Entity<GroupMemberProps> {
  private constructor(props: GroupMemberProps) {
    super(props);
  }

  /**
   * Crea una nueva instancia de miembro de grupo
   */
  public static create(props: GroupMemberProps): GroupMember {
    if (!props.groupId) {
      throw new Error('El miembro debe estar asociado a un grupo');
    }

    if (!props.userId) {
      throw new Error('El miembro debe ser un usuario');
    }

    return new GroupMember({
      ...props,
      role: props.role || GroupMemberRole.MEMBER,
      status: props.status || GroupMemberStatus.ACTIVE,
      joinedAt: props.status === GroupMemberStatus.ACTIVE ? (props.joinedAt || new Date()) : undefined,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get groupId(): string {
    return this.props.groupId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get role(): GroupMemberRole {
    return this.props.role;
  }

  get status(): GroupMemberStatus {
    return this.props.status;
  }

  get invitedById(): string | undefined {
    return this.props.invitedById;
  }

  get joinedAt(): Date | undefined {
    return this.props.joinedAt;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  // Métodos de negocio

  /**
   * Cambia el rol del miembro
   */
  changeRole(newRole: GroupMemberRole): void {
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }

  /**
   * Acepta una invitación pendiente
   */
  acceptInvitation(): void {
    if (this.props.status !== GroupMemberStatus.PENDING) {
      throw new Error('Solo se pueden aceptar invitaciones pendientes');
    }

    this.props.status = GroupMemberStatus.ACTIVE;
    this.props.joinedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Rechaza una invitación pendiente
   */
  rejectInvitation(): void {
    if (this.props.status !== GroupMemberStatus.PENDING) {
      throw new Error('Solo se pueden rechazar invitaciones pendientes');
    }

    this.props.status = GroupMemberStatus.REJECTED;
    this.props.updatedAt = new Date();
  }

  /**
   * Desactiva al miembro
   */
  deactivate(): void {
    if (this.props.status !== GroupMemberStatus.ACTIVE) {
      throw new Error('Solo se pueden desactivar miembros activos');
    }

    this.props.status = GroupMemberStatus.INACTIVE;
    this.props.updatedAt = new Date();
  }

  /**
   * Reactiva al miembro
   */
  reactivate(): void {
    if (this.props.status !== GroupMemberStatus.INACTIVE) {
      throw new Error('Solo se pueden reactivar miembros inactivos');
    }

    this.props.status = GroupMemberStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  /**
   * Actualiza los metadatos del miembro
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.props.metadata = {
      ...this.props.metadata,
      ...metadata
    };
    this.props.updatedAt = new Date();
  }
} 