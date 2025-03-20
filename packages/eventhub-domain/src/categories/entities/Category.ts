import { Entity } from '../../core/interfaces/Entity';
import { CategoryCreateException } from '../exceptions/CategoryCreateException';
import { CategoryUpdateException } from '../exceptions/CategoryUpdateException';

/**
 * Propiedades completas de una categoría
 */
export interface CategoryProps {
  /** Identificador único */
  id: string;
  /** Nombre de la categoría */
  name: string;
  /** Descripción opcional */
  description?: string;
  /** ID de la categoría padre (para categorías jerárquicas) */
  parentId?: string;
  /** Indica si la categoría está activa */
  isActive: boolean;
  /** Slug para URLs amigables */
  slug: string;
  /** Icono asociado a la categoría */
  icon?: string;
  /** Color para representación visual */
  color?: string;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
}

/**
 * Propiedades para crear una nueva categoría
 */
export interface CategoryCreateProps {
  /** Identificador único */
  id: string;
  /** Nombre de la categoría */
  name: string;
  /** Descripción opcional */
  description?: string;
  /** ID de la categoría padre (opcional) */
  parentId?: string;
  /** Icono asociado a la categoría (opcional) */
  icon?: string;
  /** Color para representación visual (opcional) */
  color?: string;
}

/**
 * Propiedades actualizables de una categoría
 */
export interface CategoryUpdateProps {
  /** Nuevo nombre (opcional) */
  name?: string;
  /** Nueva descripción (opcional) */
  description?: string;
  /** Nueva categoría padre (opcional) */
  parentId?: string;
  /** Nuevo icono (opcional) */
  icon?: string;
  /** Nuevo color (opcional) */
  color?: string;
}

/**
 * Entidad que representa una categoría para clasificar eventos
 * @implements {Entity<string>}
 */
export class Category implements Entity<string> {
  /** Identificador único */
  readonly id: string;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  private _updatedAt: Date;
  /** Nombre de la categoría */
  private _name: string;
  /** Descripción opcional de la categoría */
  private _description?: string;
  /** ID de la categoría padre */
  private _parentId?: string;
  /** Indica si la categoría está activa */
  private _isActive: boolean;
  /** Slug para URLs amigables */
  private _slug: string;
  /** Icono asociado a la categoría */
  private _icon?: string;
  /** Color para representación visual */
  private _color?: string;

  /**
   * Constructor privado (patrón Factory)
   * @param props Propiedades de la categoría
   */
  private constructor(props: CategoryProps) {
    this.id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._parentId = props.parentId;
    this._isActive = props.isActive;
    this._slug = props.slug;
    this._icon = props.icon;
    this._color = props.color;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva categoría
   * @param props Propiedades para crear la categoría
   * @returns Nueva instancia de Category
   * @throws {CategoryCreateException} Si los datos son inválidos
   */
  public static create(props: CategoryCreateProps): Category {
    if (!props.name || props.name.trim() === '') {
      throw new CategoryCreateException('El nombre de la categoría es obligatorio');
    }

    if (props.color && !this.isValidColor(props.color)) {
      throw new CategoryCreateException('El color debe ser un código hexadecimal válido (ej: #FF0000)');
    }

    const slug = this.generateSlug(props.name);
    const now = new Date();
    
    return new Category({
      ...props,
      slug,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }

  /**
   * Genera un slug a partir del nombre
   * @param name Nombre de la categoría
   * @returns Slug generado
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }

  /**
   * Valida un código de color
   * @param color Código de color (HEX)
   * @returns true si es válido
   */
  private static isValidColor(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
  }

  /** Obtiene el nombre de la categoría */
  get name(): string {
    return this._name;
  }

  /** Obtiene la descripción */
  get description(): string | undefined {
    return this._description;
  }

  /** Obtiene el ID de la categoría padre */
  get parentId(): string | undefined {
    return this._parentId;
  }

  /** Indica si la categoría está activa */
  get isActive(): boolean {
    return this._isActive;
  }

  /** Obtiene el slug para URLs */
  get slug(): string {
    return this._slug;
  }

  /** Obtiene el icono de la categoría */
  get icon(): string | undefined {
    return this._icon;
  }

  /** Obtiene el color de la categoría */
  get color(): string | undefined {
    return this._color;
  }

  /** Obtiene la fecha de última actualización */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Actualiza los datos de la categoría
   * @param props Propiedades a actualizar
   * @throws {CategoryUpdateException} Si los datos son inválidos
   */
  public update(props: CategoryUpdateProps): void {
    let updated = false;

    if (props.name !== undefined) {
      if (props.name.trim() === '') {
        throw new CategoryUpdateException('El nombre de la categoría no puede estar vacío');
      }
      this._name = props.name;
      this._slug = Category.generateSlug(props.name);
      updated = true;
    }

    if (props.description !== undefined) {
      this._description = props.description;
      updated = true;
    }

    if (props.parentId !== undefined) {
      // Comprobación para evitar categorías cíclicas - se haría en el servicio/aplicación
      this._parentId = props.parentId;
      updated = true;
    }

    if (props.icon !== undefined) {
      this._icon = props.icon;
      updated = true;
    }

    if (props.color !== undefined) {
      if (!Category.isValidColor(props.color)) {
        throw new CategoryUpdateException('El color debe ser un código hexadecimal válido (ej: #FF0000)');
      }
      this._color = props.color;
      updated = true;
    }

    if (updated) {
      this._updatedAt = new Date();
    }
  }

  /**
   * Activa la categoría
   */
  public activate(): void {
    if (this._isActive) {
      return;
    }
    
    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Desactiva la categoría
   */
  public deactivate(): void {
    if (!this._isActive) {
      return;
    }
    
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto con las propiedades de la categoría
   */
  public toObject(): CategoryProps {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      parentId: this._parentId,
      isActive: this._isActive,
      slug: this._slug,
      icon: this._icon,
      color: this._color,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }
} 