import { Entity } from '../../core/interfaces/Entity';
import { EventTypeCreateException } from '../exceptions/EventTypeCreateException';
import { EventTypeUpdateException } from '../exceptions/EventTypeUpdateException';

/**
 * Propiedades completas de un tipo de evento
 */
export interface EventTypeProps {
  /** Identificador único */
  id: string;
  /** Nombre del tipo de evento */
  name: string;
  /** Descripción opcional */
  description?: string;
  /** Icono representativo */
  icon?: string;
  /** Color para representación visual */
  color?: string;
  /** Indica si está activo */
  isActive: boolean;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
}

/**
 * Propiedades para crear un nuevo tipo de evento
 */
export interface EventTypeCreateProps {
  /** Identificador único */
  id: string;
  /** Nombre del tipo de evento */
  name: string;
  /** Descripción opcional */
  description?: string;
  /** Icono representativo */
  icon?: string;
  /** Color para representación visual */
  color?: string;
}

/**
 * Propiedades para actualizar un tipo de evento
 */
export interface EventTypeUpdateProps {
  /** Nuevo nombre */
  name?: string;
  /** Nueva descripción */
  description?: string;
  /** Nuevo icono */
  icon?: string;
  /** Nuevo color */
  color?: string;
}

/**
 * Entidad que representa un tipo de evento
 * Permite clasificar eventos según su naturaleza (concierto, conferencia, etc.)
 * @implements {Entity<string>}
 */
export class EventType implements Entity<string> {
  /** Identificador único */
  readonly id: string;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  private _updatedAt: Date;
  /** Nombre del tipo de evento */
  private _name: string;
  /** Descripción opcional */
  private _description?: string;
  /** Icono representativo */
  private _icon?: string;
  /** Color para representación visual */
  private _color?: string;
  /** Indica si está activo */
  private _isActive: boolean;

  /**
   * Constructor privado (patrón Factory)
   * @param props Propiedades del tipo de evento
   */
  private constructor(props: EventTypeProps) {
    this.id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._icon = props.icon;
    this._color = props.color;
    this._isActive = props.isActive;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Crea un nuevo tipo de evento
   * @param props Propiedades para crear el tipo de evento
   * @returns Nueva instancia de EventType
   * @throws {EventTypeCreateException} Si los datos son inválidos
   */
  public static create(props: EventTypeCreateProps): EventType {
    if (!props.name || props.name.trim() === '') {
      throw new EventTypeCreateException('El nombre del tipo de evento es obligatorio');
    }

    if (props.color && !this.isValidColor(props.color)) {
      throw new EventTypeCreateException('El color debe ser un código hexadecimal válido (ej: #FF0000)');
    }

    const now = new Date();
    return new EventType({
      ...props,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Valida un código de color
   * @param color Código de color en formato HEX
   * @returns true si es válido
   */
  private static isValidColor(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
  }

  /** Obtiene el nombre del tipo de evento */
  get name(): string {
    return this._name;
  }

  /** Obtiene la descripción */
  get description(): string | undefined {
    return this._description;
  }

  /** Obtiene el icono */
  get icon(): string | undefined {
    return this._icon;
  }

  /** Obtiene el color */
  get color(): string | undefined {
    return this._color;
  }

  /** Indica si el tipo de evento está activo */
  get isActive(): boolean {
    return this._isActive;
  }

  /** Obtiene la fecha de última actualización */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Actualiza los datos del tipo de evento
   * @param props Propiedades a actualizar
   * @throws {EventTypeUpdateException} Si los datos son inválidos
   */
  public update(props: EventTypeUpdateProps): void {
    let updated = false;

    if (props.name !== undefined) {
      if (props.name.trim() === '') {
        throw new EventTypeUpdateException('El nombre del tipo de evento no puede estar vacío');
      }
      this._name = props.name;
      updated = true;
    }

    if (props.description !== undefined) {
      this._description = props.description;
      updated = true;
    }

    if (props.icon !== undefined) {
      this._icon = props.icon;
      updated = true;
    }

    if (props.color !== undefined) {
      if (!EventType.isValidColor(props.color)) {
        throw new EventTypeUpdateException('El color debe ser un código hexadecimal válido (ej: #FF0000)');
      }
      this._color = props.color;
      updated = true;
    }

    if (updated) {
      this._updatedAt = new Date();
    }
  }

  /**
   * Activa el tipo de evento
   */
  public activate(): void {
    if (this._isActive) {
      return;
    }
    
    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Desactiva el tipo de evento
   */
  public deactivate(): void {
    if (!this._isActive) {
      return;
    }
    
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Compara si esta entidad es igual a otra
   * @param entity Otra entidad para comparar
   * @returns true si tienen el mismo ID
   */
  public equals(entity: Entity<string>): boolean {
    return this.id === entity.id;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto con las propiedades del tipo de evento
   */
  public toObject(): EventTypeProps {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      icon: this._icon,
      color: this._color,
      isActive: this._isActive,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }
} 