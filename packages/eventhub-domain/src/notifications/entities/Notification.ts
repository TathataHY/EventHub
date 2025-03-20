import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../core/interfaces/Entity';
import { NotificationType } from '../value-objects/NotificationType';
import { NotificationChannel } from '../value-objects/NotificationChannel';
import { NotificationCreateException } from '../exceptions/NotificationCreateException';

/**
 * Entidad que representa una notificación enviada a un usuario
 * 
 * Encapsula la información y comportamiento de las notificaciones
 * enviadas a través de los distintos canales de comunicación.
 * @implements {Entity<string>}
 */
export class Notification implements Entity<string> {
  /** Identificador único de la notificación */
  readonly id: string;
  /** ID del usuario destinatario */
  readonly userId: string;
  /** Título de la notificación */
  readonly title: string;
  /** Mensaje principal de la notificación */
  readonly message: string;
  /** Contenido HTML opcional para emails o notificaciones web */
  readonly html?: string;
  /** Tipo de notificación (value object) */
  readonly type: NotificationType;
  /** Canal por el que se envía la notificación (value object) */
  readonly channel: NotificationChannel;
  /** Indica si la notificación ha sido leída */
  readonly read: boolean;
  /** Indica si la notificación ha sido enviada */
  readonly sent: boolean;
  /** Fecha en que se entregó al destinatario */
  readonly deliveredAt?: Date;
  /** Fecha en que fue leída por el destinatario */
  readonly readAt?: Date;
  /** Nivel de prioridad de la notificación */
  readonly priority: 'low' | 'medium' | 'high';
  /** ID de la entidad relacionada (evento, ticket, etc.) */
  readonly relatedEntityId?: string;
  /** Tipo de la entidad relacionada */
  readonly relatedEntityType?: string;
  /** Datos adicionales en formato clave-valor */
  readonly data?: Record<string, any>;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  readonly updatedAt: Date;
  /** Indica si la notificación está activa */
  readonly isActive: boolean;

  /**
   * Constructor privado (patrón Factory)
   * @param props Propiedades completas de la notificación
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
    this.isActive = props.isActive !== undefined ? props.isActive : true;
  }

  /**
   * Crea una nueva notificación
   * @param props Propiedades para crear la notificación
   * @returns Nueva instancia de Notification
   * @throws {NotificationCreateException} Si los datos son inválidos
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
      updatedAt: props.updatedAt || new Date(),
      isActive: props.isActive !== undefined ? props.isActive : true
    });
  }

  /**
   * Reconstruye una notificación desde persistencia
   * @param props Propiedades completas de la notificación
   * @returns Instancia de Notification reconstruida
   */
  static reconstitute(props: NotificationProps): Notification {
    return new Notification(props);
  }

  /**
   * Compara si esta notificación es igual a otra entidad
   * @param entity Otra entidad para comparar
   * @returns true si tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Notification)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Marca la notificación como leída
   * @returns Nueva instancia con la notificación marcada como leída
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
   * @returns Nueva instancia con la notificación marcada como enviada
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
   * @returns Nueva instancia con el mensaje actualizado
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
   * @returns Nueva instancia con el título actualizado
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
   * Actualiza el contenido HTML de la notificación
   * @param html Nuevo contenido HTML
   * @returns Nueva instancia con el HTML actualizado
   */
  updateHtml(html: string): Notification {
    return new Notification({
      ...this.toObject(),
      html,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza los datos adicionales de la notificación
   * @param data Nuevos datos en formato clave-valor
   * @returns Nueva instancia con los datos actualizados
   */
  updateData(data: Record<string, any>): Notification {
    return new Notification({
      ...this.toObject(),
      data,
      updatedAt: new Date()
    });
  }

  /**
   * Obtiene un valor específico de los datos adicionales
   * @param key Clave del valor a obtener
   * @returns Valor asociado a la clave o undefined si no existe
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
   * @returns Objeto con todas las propiedades de la notificación
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
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }
}

/**
 * Propiedades completas de una notificación
 */
export interface NotificationProps {
  /** Identificador único */
  id: string;
  /** ID del usuario destinatario */
  userId: string;
  /** Título de la notificación */
  title: string;
  /** Mensaje principal */
  message: string;
  /** Contenido HTML opcional */
  html?: string;
  /** Tipo de notificación */
  type: NotificationType;
  /** Canal de envío */
  channel: NotificationChannel;
  /** Indica si ha sido leída */
  read: boolean;
  /** Indica si ha sido enviada */
  sent: boolean;
  /** Fecha de entrega */
  deliveredAt?: Date;
  /** Fecha de lectura */
  readAt?: Date;
  /** Nivel de prioridad */
  priority: 'low' | 'medium' | 'high';
  /** ID de entidad relacionada */
  relatedEntityId?: string;
  /** Tipo de entidad relacionada */
  relatedEntityType?: string;
  /** Datos adicionales */
  data?: Record<string, any>;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de actualización */
  updatedAt: Date;
  /** Indica si la notificación está activa */
  isActive: boolean;
}

/**
 * Propiedades para crear una nueva notificación
 */
export interface NotificationCreateProps {
  /** Identificador único (opcional) */
  id?: string;
  /** ID del usuario destinatario */
  userId: string;
  /** Título de la notificación */
  title: string;
  /** Mensaje principal */
  message: string;
  /** Contenido HTML opcional */
  html?: string;
  /** Tipo de notificación */
  type: NotificationType;
  /** Canal de envío (por defecto según tipo) */
  channel?: NotificationChannel;
  /** Estado de lectura inicial (por defecto false) */
  read?: boolean;
  /** Estado de envío inicial (por defecto false) */
  sent?: boolean;
  /** Fecha de entrega (si ya fue entregada) */
  deliveredAt?: Date;
  /** Fecha de lectura (si ya fue leída) */
  readAt?: Date;
  /** Nivel de prioridad (por defecto medium) */
  priority?: 'low' | 'medium' | 'high';
  /** ID de entidad relacionada */
  relatedEntityId?: string;
  /** Tipo de entidad relacionada */
  relatedEntityType?: string;
  /** Datos adicionales */
  data?: Record<string, any>;
  /** Fecha de creación (por defecto ahora) */
  createdAt?: Date;
  /** Fecha de actualización (por defecto ahora) */
  updatedAt?: Date;
  /** Indica si la notificación está activa */
  isActive?: boolean;
} 