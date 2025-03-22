import { Entity } from '../../core/interfaces/Entity';

/**
 * Enum para el estado de un grupo
 * 
 * Define los posibles estados en los que puede encontrarse un grupo 
 * a lo largo de su ciclo de vida dentro de la plataforma.
 */
export enum GroupStatus {
  /** Grupo activo y disponible para unirse */
  ACTIVE = 'ACTIVE',
  /** Grupo temporalmente desactivado */
  INACTIVE = 'INACTIVE',
  /** Grupo cerrado permanentemente */
  CLOSED = 'CLOSED'
}

/**
 * Propiedades completas de un grupo
 * 
 * Define todas las propiedades necesarias para representar un grupo
 * en el sistema, incluyendo sus datos básicos, configuración y metadatos.
 */
export interface GroupProps {
  /** Identificador único del grupo */
  id: string;
  /** Nombre del grupo visible para los usuarios */
  name: string;
  /** Descripción detallada del propósito del grupo */
  description?: string;
  /** ID del evento al que está asociado el grupo */
  eventId: string;
  /** ID del usuario que creó el grupo */
  createdById: string;
  /** Código para invitar a otros usuarios al grupo */
  invitationCode?: string;
  /** Número máximo de miembros permitidos */
  maxMembers?: number;
  /** Estado actual del grupo (activo, inactivo o cerrado) */
  status: GroupStatus;
  /** Datos adicionales asociados al grupo */
  metadata?: Record<string, any>;
  /** Fecha de creación del grupo */
  createdAt: Date;
  /** Fecha de última actualización del grupo */
  updatedAt: Date;
  /** Indica si el grupo está activo en el sistema */
  isActive: boolean;
  /** Lista de miembros del grupo */
  members?: any[];
}

/**
 * Propiedades para crear un nuevo grupo
 */
export interface GroupCreateProps {
  /** Identificador único (opcional) */
  id?: string;
  /** Nombre del grupo */
  name: string;
  /** Descripción del grupo (opcional) */
  description?: string;
  /** ID del evento asociado */
  eventId: string;
  /** ID del usuario creador */
  createdById: string;
  /** Código de invitación (opcional) */
  invitationCode?: string;
  /** Límite de miembros (opcional) */
  maxMembers?: number;
  /** Estado inicial (opcional) */
  status?: GroupStatus;
  /** Metadatos adicionales (opcional) */
  metadata?: Record<string, any>;
  /** Fecha de creación (opcional) */
  createdAt?: Date;
  /** Fecha de actualización (opcional) */
  updatedAt?: Date;
  /** Estado de activación inicial (opcional) */
  isActive?: boolean;
}

/**
 * Entidad que representa un grupo de usuarios asociados a un evento
 * 
 * Los grupos permiten que varios asistentes puedan organizarse para participar
 * juntos en un evento, compartir información, coordinar actividades y
 * mantener comunicación entre ellos. Un grupo está siempre asociado a un evento
 * específico y tiene un creador que actúa como administrador inicial.
 * 
 * @implements {Entity<string>} Implementa la interfaz Entity con ID tipo string
 */
export class Group implements Entity<string> {
  /** Identificador único del grupo */
  readonly id: string;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  readonly updatedAt: Date;
  /** Indica si el grupo está activo */
  readonly isActive: boolean;
  /** Nombre del grupo */
  private _name: string;
  /** Descripción del grupo */
  private _description?: string;
  /** ID del evento asociado */
  private readonly _eventId: string;
  /** ID del usuario creador */
  private readonly _createdById: string;
  /** Código de invitación */
  private _invitationCode?: string;
  /** Límite de miembros */
  private _maxMembers?: number;
  /** Estado actual */
  private _status: GroupStatus;
  /** Metadatos adicionales */
  private _metadata?: Record<string, any>;

  /**
   * Constructor privado para garantizar que los grupos se creen
   * a través del método factory con las validaciones necesarias
   * 
   * @param props Propiedades iniciales del grupo
   */
  private constructor(props: GroupProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.isActive = props.isActive;
    this._name = props.name;
    this._description = props.description;
    this._eventId = props.eventId;
    this._createdById = props.createdById;
    this._invitationCode = props.invitationCode;
    this._maxMembers = props.maxMembers;
    this._status = props.status;
    this._metadata = props.metadata;
  }

  /**
   * Crea una nueva instancia de grupo aplicando validaciones
   * 
   * Este método factory garantiza que el grupo se cree con
   * todos los datos obligatorios y en un estado válido.
   * 
   * @param props Propiedades del grupo a crear
   * @returns Nueva instancia de Group
   * @throws Error si faltan datos obligatorios o son inválidos
   */
  public static create(props: GroupCreateProps): Group {
    if (!props.name) {
      throw new Error('El grupo debe tener un nombre');
    }

    if (!props.eventId) {
      throw new Error('El grupo debe estar asociado a un evento');
    }

    if (!props.createdById) {
      throw new Error('El grupo debe tener un creador');
    }

    const now = new Date();

    return new Group({
      id: props.id || `group-${Date.now()}`,
      name: props.name,
      description: props.description,
      eventId: props.eventId,
      createdById: props.createdById,
      invitationCode: props.invitationCode,
      maxMembers: props.maxMembers,
      status: props.status || GroupStatus.ACTIVE,
      metadata: props.metadata,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
      isActive: props.isActive !== undefined ? props.isActive : true
    });
  }

  /**
   * Compara si este grupo es igual a otra entidad
   * 
   * Dos grupos son iguales si tienen el mismo ID
   * 
   * @param entity Otra entidad para comparar
   * @returns true si tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Group)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Obtiene el nombre del grupo
   * @returns Nombre del grupo
   */
  get name(): string {
    return this._name;
  }

  /**
   * Obtiene la descripción del grupo
   * @returns Descripción del grupo o undefined si no tiene
   */
  get description(): string | undefined {
    return this._description;
  }

  /**
   * Obtiene el ID del evento asociado al grupo
   * @returns ID del evento
   */
  get eventId(): string {
    return this._eventId;
  }

  /**
   * Obtiene el ID del usuario que creó el grupo
   * @returns ID del creador
   */
  get createdById(): string {
    return this._createdById;
  }

  /**
   * Obtiene el código de invitación del grupo
   * @returns Código de invitación o undefined si no se ha generado
   */
  get invitationCode(): string | undefined {
    return this._invitationCode;
  }

  /**
   * Obtiene el número máximo de miembros permitidos
   * @returns Límite máximo de miembros o undefined si no hay límite
   */
  get maxMembers(): number | undefined {
    return this._maxMembers;
  }

  /**
   * Obtiene el estado actual del grupo
   * @returns Estado del grupo (ACTIVE, INACTIVE o CLOSED)
   */
  get status(): GroupStatus {
    return this._status;
  }

  /**
   * Obtiene los metadatos adicionales del grupo
   * @returns Objeto con metadatos o undefined si no tiene
   */
  get metadata(): Record<string, any> | undefined {
    return this._metadata;
  }

  /**
   * Actualiza la información básica del grupo
   * 
   * Permite modificar el nombre, descripción y límite de miembros
   * del grupo, manteniendo el resto de propiedades.
   * 
   * @param name Nuevo nombre del grupo
   * @param description Nueva descripción (opcional)
   * @param maxMembers Nuevo límite de miembros (opcional)
   * @returns Nueva instancia con los datos actualizados
   */
  update(name: string, description?: string, maxMembers?: number): Group {
    if (!name) {
      throw new Error('El nombre del grupo no puede estar vacío');
    }

    const updatedProps: GroupProps = {
      id: this.id,
      name: name,
      description: description,
      eventId: this._eventId,
      createdById: this._createdById,
      invitationCode: this._invitationCode,
      maxMembers: maxMembers,
      status: this._status,
      metadata: this._metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      isActive: this.isActive
    };

    return new Group(updatedProps);
  }

  /**
   * Genera o establece un código de invitación para el grupo
   * 
   * Si no se proporciona un código, se genera uno automáticamente
   * que los usuarios pueden utilizar para unirse al grupo.
   * 
   * @param code Código de invitación personalizado (opcional)
   * @returns Nueva instancia con el código de invitación actualizado
   */
  generateInvitationCode(code?: string): Group {
    const invitationCode = code || Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const updatedProps: GroupProps = {
      id: this.id,
      name: this._name,
      description: this._description,
      eventId: this._eventId,
      createdById: this._createdById,
      invitationCode: invitationCode,
      maxMembers: this._maxMembers,
      status: this._status,
      metadata: this._metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      isActive: this.isActive
    };

    return new Group(updatedProps);
  }

  /**
   * Desactiva temporalmente el grupo
   * 
   * Un grupo desactivado no permite nuevos miembros ni interacciones,
   * pero puede ser reactivado posteriormente.
   * 
   * @throws Error si el grupo ya está cerrado permanentemente
   * @returns Nueva instancia con el grupo desactivado
   */
  deactivate(): Group {
    if (this._status === GroupStatus.CLOSED) {
      throw new Error('No se puede desactivar un grupo cerrado');
    }
    
    const updatedProps: GroupProps = {
      id: this.id,
      name: this._name,
      description: this._description,
      eventId: this._eventId,
      createdById: this._createdById,
      invitationCode: this._invitationCode,
      maxMembers: this._maxMembers,
      status: GroupStatus.INACTIVE,
      metadata: this._metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      isActive: false
    };

    return new Group(updatedProps);
  }

  /**
   * Reactiva un grupo previamente desactivado
   * 
   * @throws Error si el grupo está cerrado permanentemente
   * @returns Nueva instancia con el grupo reactivado
   */
  activate(): Group {
    if (this._status === GroupStatus.CLOSED) {
      throw new Error('No se puede activar un grupo cerrado');
    }
    
    const updatedProps: GroupProps = {
      id: this.id,
      name: this._name,
      description: this._description,
      eventId: this._eventId,
      createdById: this._createdById,
      invitationCode: this._invitationCode,
      maxMembers: this._maxMembers,
      status: GroupStatus.ACTIVE,
      metadata: this._metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      isActive: true
    };

    return new Group(updatedProps);
  }

  /**
   * Cierra permanentemente el grupo
   * 
   * Un grupo cerrado no puede ser reactivado y no permite
   * nuevas interacciones ni miembros.
   * 
   * @returns Nueva instancia con el grupo cerrado
   */
  close(): Group {
    const updatedProps: GroupProps = {
      id: this.id,
      name: this._name,
      description: this._description,
      eventId: this._eventId,
      createdById: this._createdById,
      invitationCode: this._invitationCode,
      maxMembers: this._maxMembers,
      status: GroupStatus.CLOSED,
      metadata: this._metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      isActive: false
    };

    return new Group(updatedProps);
  }

  /**
   * Verifica si se puede añadir un nuevo miembro al grupo
   * 
   * Comprueba si el grupo está activo y si no se ha alcanzado
   * el límite máximo de miembros permitidos.
   * 
   * @param currentMemberCount Número actual de miembros en el grupo
   * @returns true si se puede añadir un nuevo miembro, false en caso contrario
   */
  canAddMember(currentMemberCount: number): boolean {
    // No se pueden añadir miembros a grupos inactivos o cerrados
    if (this._status !== GroupStatus.ACTIVE || !this.isActive) {
      return false;
    }

    // Si hay un límite de miembros, verificar que no se ha superado
    if (this._maxMembers !== undefined) {
      return currentMemberCount < this._maxMembers;
    }

    // Si no hay límite, siempre se pueden añadir miembros
    return true;
  }

  /**
   * Actualiza los metadatos asociados al grupo
   * 
   * Permite almacenar información adicional personalizada
   * relacionada con el grupo o sus características.
   * 
   * @param metadata Objeto con los nuevos metadatos
   * @returns Nueva instancia con los metadatos actualizados
   */
  updateMetadata(metadata: Record<string, any>): Group {
    const updatedMetadata = {
      ...this._metadata,
      ...metadata
    };
    
    const updatedProps: GroupProps = {
      id: this.id,
      name: this._name,
      description: this._description,
      eventId: this._eventId,
      createdById: this._createdById,
      invitationCode: this._invitationCode,
      maxMembers: this._maxMembers,
      status: this._status,
      metadata: updatedMetadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      isActive: this.isActive
    };

    return new Group(updatedProps);
  }
} 