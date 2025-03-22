import { Entity } from '../../core/interfaces/Entity';
import { FileType, FileTypeEnum } from '../value-objects/FileType';
import { MediaFileCreateException } from '../exceptions/MediaFileCreateException';
import { MediaFileUpdateException } from '../exceptions/MediaFileUpdateException';

export enum MediaEntityType {
  EVENT = 'event',
  USER = 'user',
  GROUP = 'group',
  LOCATION = 'location',
  CATEGORY = 'category',
  EVENT_TYPE = 'event_type',
  OTHER = 'other'
}

export interface MediaFileProps {
  id: string;
  fileName: string;
  originalName: string;
  fileType: FileType;
  mimeType: string;
  size: number;
  url: string;
  altText?: string;
  title?: string;
  description?: string;
  entityId?: string;
  entityType?: MediaEntityType;
  isPublic: boolean;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFileCreateProps {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string;
  title?: string;
  description?: string;
  entityId?: string;
  entityType?: MediaEntityType;
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

export interface MediaFileUpdateProps {
  altText?: string;
  title?: string;
  description?: string;
  entityId?: string;
  entityType?: MediaEntityType;
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

export class MediaFile implements Entity<string> {
  readonly id: string;
  readonly fileName: string;
  readonly originalName: string;
  readonly fileType: FileType;
  readonly mimeType: string;
  readonly size: number;
  readonly url: string;
  readonly createdAt: Date;
  private _updatedAt: Date;
  private _altText?: string;
  private _title?: string;
  private _description?: string;
  private _entityId?: string;
  private _entityType?: MediaEntityType;
  private _isPublic: boolean;
  private _isActive: boolean;
  private _metadata?: Record<string, any>;

  private constructor(props: MediaFileProps) {
    this.id = props.id;
    this.fileName = props.fileName;
    this.originalName = props.originalName;
    this.fileType = props.fileType;
    this.mimeType = props.mimeType;
    this.size = props.size;
    this.url = props.url;
    this._altText = props.altText;
    this._title = props.title;
    this._description = props.description;
    this._entityId = props.entityId;
    this._entityType = props.entityType;
    this._isPublic = props.isPublic;
    this._isActive = props.isActive;
    this._metadata = props.metadata;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: MediaFileCreateProps): MediaFile {
    if (!props.fileName) {
      throw new MediaFileCreateException('El nombre del archivo es obligatorio');
    }

    if (!props.originalName) {
      throw new MediaFileCreateException('El nombre original del archivo es obligatorio');
    }

    if (!props.mimeType) {
      throw new MediaFileCreateException('El tipo MIME del archivo es obligatorio');
    }

    if (props.size <= 0) {
      throw new MediaFileCreateException('El tamaño del archivo debe ser mayor a 0');
    }

    if (!props.url) {
      throw new MediaFileCreateException('La URL del archivo es obligatoria');
    }

    // Validar entityType si está presente
    if (props.entityType && !Object.values(MediaEntityType).includes(props.entityType)) {
      throw new MediaFileCreateException(`Tipo de entidad inválido: ${props.entityType}`);
    }

    // Si existe entityType, debe existir entityId
    if (props.entityType && !props.entityId) {
      throw new MediaFileCreateException('El ID de entidad es obligatorio cuando se especifica el tipo de entidad');
    }

    const fileType = FileType.fromMimeType(props.mimeType);
    const now = new Date();

    return new MediaFile({
      ...props,
      fileType,
      isPublic: props.isPublic !== undefined ? props.isPublic : true,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }

  get altText(): string | undefined {
    return this._altText;
  }

  get title(): string | undefined {
    return this._title;
  }

  get description(): string | undefined {
    return this._description;
  }

  get entityId(): string | undefined {
    return this._entityId;
  }

  get entityType(): MediaEntityType | undefined {
    return this._entityType;
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Obtiene el tamaño formateado (KB, MB, GB)
   */
  public getFormattedSize(): string {
    if (this.size < 1024) {
      return `${this.size} bytes`;
    } else if (this.size < 1024 * 1024) {
      return `${(this.size / 1024).toFixed(2)} KB`;
    } else if (this.size < 1024 * 1024 * 1024) {
      return `${(this.size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(this.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  /**
   * Comprueba si el archivo está relacionado con una entidad específica
   */
  public isRelatedTo(entityType: MediaEntityType, entityId: string): boolean {
    return this._entityType === entityType && this._entityId === entityId;
  }

  public update(props: MediaFileUpdateProps): void {
    let updated = false;

    if (props.altText !== undefined) {
      this._altText = props.altText;
      updated = true;
    }

    if (props.title !== undefined) {
      this._title = props.title;
      updated = true;
    }

    if (props.description !== undefined) {
      this._description = props.description;
      updated = true;
    }

    if (props.entityId !== undefined || props.entityType !== undefined) {
      // Si se actualiza un campo de entidad, ambos deben estar presentes
      const newEntityId = props.entityId !== undefined ? props.entityId : this._entityId;
      const newEntityType = props.entityType !== undefined ? props.entityType : this._entityType;

      if (!newEntityId && newEntityType) {
        throw new MediaFileUpdateException('El ID de entidad es obligatorio cuando se especifica el tipo de entidad');
      }

      // Validar entityType si está presente
      if (newEntityType && !Object.values(MediaEntityType).includes(newEntityType)) {
        throw new MediaFileUpdateException(`Tipo de entidad inválido: ${newEntityType}`);
      }

      this._entityId = newEntityId;
      this._entityType = newEntityType;
      updated = true;
    }

    if (props.isPublic !== undefined) {
      this._isPublic = props.isPublic;
      updated = true;
    }

    if (props.metadata !== undefined) {
      this._metadata = props.metadata;
      updated = true;
    }

    if (updated) {
      this._updatedAt = new Date();
    }
  }

  public activate(): void {
    if (this._isActive) {
      return;
    }
    
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    if (!this._isActive) {
      return;
    }
    
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public toObject(): MediaFileProps {
    return {
      id: this.id,
      fileName: this.fileName,
      originalName: this.originalName,
      fileType: this.fileType,
      mimeType: this.mimeType,
      size: this.size,
      url: this.url,
      altText: this._altText,
      title: this._title,
      description: this._description,
      entityId: this._entityId,
      entityType: this._entityType,
      isPublic: this._isPublic,
      isActive: this._isActive,
      metadata: this._metadata,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Compara si dos entidades MediaFile son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof MediaFile)) {
      return false;
    }
    
    return this.id === entity.id;
  }
} 