import { NotificationCreateException } from '../exceptions/NotificationCreateException';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '../value-objects/NotificationType';

/**
 * Entidad de Notificación en el dominio
 */
export class Notification {
  private _id: string;
  private _userId: string;
  private _title: string;
  private _message: string;
  private _type: NotificationType;
  private _read: boolean;
  private _relatedEntityId?: string;
  private _relatedEntityType?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Crea una nueva notificación
   * @param id Id de la notificación
   * @param userId Id del usuario al que pertenece la notificación
   * @param title Título de la notificación
   * @param message Mensaje de la notificación
   * @param type Tipo de notificación
   * @param read Indica si la notificación ha sido leída
   * @param relatedEntityId Id de la entidad relacionada (opcional)
   * @param relatedEntityType Tipo de la entidad relacionada (opcional)
   * @param createdAt Fecha de creación
   * @param updatedAt Fecha de actualización
   */
  constructor(
    id: string,
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
    read: boolean = false,
    relatedEntityId?: string,
    relatedEntityType?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id || uuidv4();
    this._userId = userId;
    this._title = title;
    this._message = message;
    this._type = type;
    this._read = read;
    this._relatedEntityId = relatedEntityId;
    this._relatedEntityType = relatedEntityType;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();

    this.validate();
  }

  /**
   * Valida que la notificación sea válida
   * @throws NotificationCreateException
   */
  private validate(): void {
    if (!this._userId) {
      throw new NotificationCreateException('El ID de usuario es requerido');
    }

    if (!this._title) {
      throw new NotificationCreateException('El título es requerido');
    }

    if (!this._message) {
      throw new NotificationCreateException('El mensaje es requerido');
    }
  }

  /**
   * Marca la notificación como leída
   */
  markAsRead(): void {
    this._read = true;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza el mensaje de la notificación
   * @param message Nuevo mensaje
   */
  updateMessage(message: string): void {
    if (!message) {
      throw new NotificationCreateException('El mensaje es requerido');
    }
    this._message = message;
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get type(): NotificationType {
    return this._type;
  }

  get read(): boolean {
    return this._read;
  }

  get relatedEntityId(): string | undefined {
    return this._relatedEntityId;
  }

  get relatedEntityType(): string | undefined {
    return this._relatedEntityType;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}

export interface NotificationParams {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 