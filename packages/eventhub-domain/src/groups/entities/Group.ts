import { Entity } from '../../../core/interfaces/Entity';

/**
 * Enum para el estado de un grupo
 */
export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED'
}

/**
 * Interfaz para las propiedades del grupo
 */
export interface GroupProps {
  id?: string;
  name: string;
  description?: string;
  eventId: string;
  createdById: string;
  invitationCode?: string;
  maxMembers?: number;
  status: GroupStatus;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidad de grupo
 */
export class Group extends Entity<GroupProps> {
  private constructor(props: GroupProps) {
    super(props);
  }

  /**
   * Crea una nueva instancia de grupo
   */
  public static create(props: GroupProps): Group {
    if (!props.name) {
      throw new Error('El grupo debe tener un nombre');
    }

    if (!props.eventId) {
      throw new Error('El grupo debe estar asociado a un evento');
    }

    if (!props.createdById) {
      throw new Error('El grupo debe tener un creador');
    }

    return new Group({
      ...props,
      status: props.status || GroupStatus.ACTIVE,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get createdById(): string {
    return this.props.createdById;
  }

  get invitationCode(): string | undefined {
    return this.props.invitationCode;
  }

  get maxMembers(): number | undefined {
    return this.props.maxMembers;
  }

  get status(): GroupStatus {
    return this.props.status;
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
   * Actualiza la información del grupo
   */
  update(name: string, description?: string, maxMembers?: number): void {
    this.props.name = name;
    this.props.description = description;
    
    if (maxMembers !== undefined) {
      this.props.maxMembers = maxMembers;
    }
    
    this.props.updatedAt = new Date();
  }

  /**
   * Genera un código de invitación para el grupo
   * @param code Código de invitación (opcional)
   */
  generateInvitationCode(code?: string): string {
    const newCode = code || Math.random().toString(36).substring(2, 10).toUpperCase();
    this.props.invitationCode = newCode;
    this.props.updatedAt = new Date();
    return newCode;
  }

  /**
   * Desactiva el grupo
   */
  deactivate(): void {
    this.props.status = GroupStatus.INACTIVE;
    this.props.updatedAt = new Date();
  }

  /**
   * Activa el grupo
   */
  activate(): void {
    this.props.status = GroupStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  /**
   * Cierra el grupo permanentemente
   */
  close(): void {
    this.props.status = GroupStatus.CLOSED;
    this.props.updatedAt = new Date();
  }

  /**
   * Verifica si el grupo está abierto para nuevos miembros
   * @param currentMemberCount Número actual de miembros
   */
  canAddMember(currentMemberCount: number): boolean {
    if (this.props.status !== GroupStatus.ACTIVE) {
      return false;
    }
    
    if (this.props.maxMembers && currentMemberCount >= this.props.maxMembers) {
      return false;
    }
    
    return true;
  }

  /**
   * Actualiza los metadatos del grupo
   */
  updateMetadata(metadata: Record<string, any>): void {
    this.props.metadata = {
      ...this.props.metadata,
      ...metadata
    };
    this.props.updatedAt = new Date();
  }
} 