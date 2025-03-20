import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { NotificationType } from '../value-objects/NotificationType';
import { NotificationChannel } from '../value-objects/NotificationChannel';
import { NotificationCreateException } from '../exceptions/NotificationCreateException';

/**
 * Entidad de Notificación en el dominio
 * Implementa Entity para seguir el patrón común de entidades
 */
export class Notification implements Entity<string> {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly message: string;
  readonly html?: string;
  readonly type: NotificationType;
  readonly channel: NotificationChannel;
  readonly read: boolean;
  readonly sent: boolean;
  readonly deliveredAt?: Date;
  readonly readAt?: Date;
  readonly priority: 'low' | 'medium' | 'high';
  readonly relatedEntityId?: string;
  readonly relatedEntityType?: string;
  readonly data?: Record<string, any>;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de Notification
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: NotificationProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.title = props.title;
    this.message = props.message;
    this.html = props.html;
    this.type = props.type;
    this.channel = props.channel;
    this.read = props.read;
    this.sent = props.sent;
    this.deliveredAt = props.deliveredAt;
    this.readAt = props.readAt;
    this.priority = props.priority;
    this.relatedEntityId = props.relatedEntityId;
    this.relatedEntityType = props.relatedEntityType;
    this.data = props.data;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva notificación validando los datos
   * @param props Propiedades para crear la notificación
   * @returns Nueva instancia de Notification
   * @throws NotificationCreateException si los datos no son válidos
   */
  static create(props: NotificationCreateProps): Notification {
    const id = props.id || uuidv4();
    
    // Validar userId
    if (!props.userId) {
      throw new NotificationCreateException('El ID de usuario es requerido');
    }

    // Validar título
    if (!props.title) {
      throw new NotificationCreateException('El título es requerido');
    }

    // Validar mensaje
    if (!props.message) {
      throw new NotificationCreateException('El mensaje es requerido');
    }

    // Validar canal y HTML
    const channel = props.channel || NotificationChannel.IN_APP;
    if (channel === NotificationChannel.EMAIL && !props.html) {
      throw new NotificationCreateException('El HTML es requerido para notificaciones por email');
    }

    // Crear notificación
    return new Notification({
      id,
      userId: props.userId,
      title: props.title,
      message: props.message,
      html: props.html,
      type: props.type,
      channel,
      read: props.read || false,
      sent: props.sent || false,
      deliveredAt: props.deliveredAt,
      readAt: props.readAt,
      priority: props.priority || 'medium',
      relatedEntityId: props.relatedEntityId,
      relatedEntityType: props.relatedEntityType,
      data: props.data,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye una Notification desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir la notificación
   * @returns Instancia de Notification reconstruida
   */
  static reconstitute(props: NotificationProps): Notification {
    return new Notification(props);
  }

  /**
   * Compara si dos entidades Notification son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Notification)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Marca la notificación como leída
   * @returns Notificación actualizada
   */
  markAsRead(): Notification {
    if (this.read) {
      return this; // Ya está marcada como leída
    }

    return new Notification({
      ...this.toObject(),
      read: true,
      readAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Marca la notificación como enviada
   * @returns Notificación actualizada
   */
  markAsSent(): Notification {
    if (this.sent) {
      return this; // Ya está marcada como enviada
    }

    return new Notification({
      ...this.toObject(),
      sent: true,
      deliveredAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza el mensaje de la notificación
   * @param message Nuevo mensaje
   * @returns Notificación actualizada
   * @throws NotificationCreateException si el mensaje no es válido
   */
  updateMessage(message: string): Notification {
    if (!message) {
      throw new NotificationCreateException('El mensaje es requerido');
    }

    return new Notification({
      ...this.toObject(),
      message,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza el título de la notificación
   * @param title Nuevo título
   * @returns Notificación actualizada
   * @throws NotificationCreateException si el título no es válido
   */
  updateTitle(title: string): Notification {
    if (!title) {
      throw new NotificationCreateException('El título es requerido');
    }

    return new Notification({
      ...this.toObject(),
      title,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza el HTML de la notificación
   * @param html Nuevo HTML
   * @returns Notificación actualizada
   */
  updateHtml(html: string): Notification {
    return new Notification({
      ...this.toObject(),
      html,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza los datos de la notificación
   * @param data Nuevos datos
   * @returns Notificación actualizada
   */
  updateData(data: Record<string, any>): Notification {
    return new Notification({
      ...this.toObject(),
      data,
      updatedAt: new Date()
    });
  }

  /**
   * Extrae una variable del contexto de datos
   * @param key Clave de la variable
   * @returns Valor de la variable o undefined si no existe
   */
  getDataValue(key: string): any {
    if (!this.data) {
      return undefined;
    }
    
    const keys = key.split('.');
    let value = this.data;
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[k];
    }
    
    return value;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades de la notificación
   */
  toObject(): NotificationProps {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      message: this.message,
      html: this.html,
      type: this.type,
      channel: this.channel,
      read: this.read,
      sent: this.sent,
      deliveredAt: this.deliveredAt,
      readAt: this.readAt,
      priority: this.priority,
      relatedEntityId: this.relatedEntityId,
      relatedEntityType: this.relatedEntityType,
      data: this.data,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir una notificación existente
 */
export interface NotificationProps {
  id: string;
  userId: string;
  title: string;
  message: string;
  html?: string;
  type: NotificationType;
  channel: NotificationChannel;
  read: boolean;
  sent: boolean;
  deliveredAt?: Date;
  readAt?: Date;
  priority: 'low' | 'medium' | 'high';
  relatedEntityId?: string;
  relatedEntityType?: string;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear una nueva notificación
 */
export interface NotificationCreateProps {
  id?: string;
  userId: string;
  title: string;
  message: string;
  html?: string;
  type: NotificationType;
  channel?: NotificationChannel;
  read?: boolean;
  sent?: boolean;
  deliveredAt?: Date;
  readAt?: Date;
  priority?: 'low' | 'medium' | 'high';
  relatedEntityId?: string;
  relatedEntityType?: string;
  data?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
} 