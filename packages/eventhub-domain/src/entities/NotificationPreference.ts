import { NotificationType } from '../value-objects/NotificationType';

/**
 * Entidad de Preferencias de Notificación en el dominio
 */
export class NotificationPreference {
  private _id: string;
  private _userId: string;
  
  // Canales de notificación
  private _emailEnabled: boolean;
  private _pushEnabled: boolean;
  private _inAppEnabled: boolean;
  
  // Tipos de notificaciones
  private _eventReminder: boolean;
  private _eventUpdated: boolean;
  private _eventCancelled: boolean;
  private _newAttendee: boolean;
  private _attendeeRemoved: boolean;
  private _systemNotifications: boolean;
  
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    emailEnabled: boolean = true,
    pushEnabled: boolean = false,
    inAppEnabled: boolean = true,
    eventReminder: boolean = true,
    eventUpdated: boolean = true,
    eventCancelled: boolean = true,
    newAttendee: boolean = true,
    attendeeRemoved: boolean = true,
    systemNotifications: boolean = true,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._userId = userId;
    
    // Canales
    this._emailEnabled = emailEnabled;
    this._pushEnabled = pushEnabled;
    this._inAppEnabled = inAppEnabled;
    
    // Tipos
    this._eventReminder = eventReminder;
    this._eventUpdated = eventUpdated;
    this._eventCancelled = eventCancelled;
    this._newAttendee = newAttendee;
    this._attendeeRemoved = attendeeRemoved;
    this._systemNotifications = systemNotifications;
    
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    
    this.validate();
  }

  // Getters
  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get emailEnabled(): boolean { return this._emailEnabled; }
  get pushEnabled(): boolean { return this._pushEnabled; }
  get inAppEnabled(): boolean { return this._inAppEnabled; }
  get eventReminder(): boolean { return this._eventReminder; }
  get eventUpdated(): boolean { return this._eventUpdated; }
  get eventCancelled(): boolean { return this._eventCancelled; }
  get newAttendee(): boolean { return this._newAttendee; }
  get attendeeRemoved(): boolean { return this._attendeeRemoved; }
  get systemNotifications(): boolean { return this._systemNotifications; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  /**
   * Verifica si un tipo de notificación está habilitado
   * @param type Tipo de notificación
   * @returns true si está habilitado
   */
  isTypeEnabled(type: NotificationType): boolean {
    switch (type) {
      case NotificationType.REMINDER:
        return this._eventReminder;
      case NotificationType.EVENT_UPDATED:
        return this._eventUpdated;
      case NotificationType.EVENT_CANCELLED:
        return this._eventCancelled;
      case NotificationType.ATTENDEE_ADDED:
        return this._newAttendee;
      case NotificationType.ATTENDEE_REMOVED:
        return this._attendeeRemoved;
      case NotificationType.INFO:
      case NotificationType.WARNING:
      case NotificationType.ERROR:
      case NotificationType.SUCCESS:
        return this._systemNotifications;
      default:
        return true;
    }
  }

  /**
   * Verifica si un canal de notificación está habilitado
   * @param channel Canal de notificación
   * @returns true si está habilitado
   */
  isChannelEnabled(channel: 'email' | 'push' | 'inApp'): boolean {
    switch (channel) {
      case 'email':
        return this._emailEnabled;
      case 'push':
        return this._pushEnabled;
      case 'inApp':
        return this._inAppEnabled;
      default:
        return false;
    }
  }

  /**
   * Actualiza las preferencias de canal
   * @param params Nuevos valores para los canales
   */
  updateChannels(params: {
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
  }): void {
    if (params.emailEnabled !== undefined) this._emailEnabled = params.emailEnabled;
    if (params.pushEnabled !== undefined) this._pushEnabled = params.pushEnabled;
    if (params.inAppEnabled !== undefined) this._inAppEnabled = params.inAppEnabled;
    
    this._updatedAt = new Date();
  }

  /**
   * Actualiza las preferencias de tipos de notificaciones
   * @param params Nuevos valores para los tipos
   */
  updateTypePreferences(params: {
    eventReminder?: boolean;
    eventUpdated?: boolean;
    eventCancelled?: boolean;
    newAttendee?: boolean;
    attendeeRemoved?: boolean;
    systemNotifications?: boolean;
  }): void {
    if (params.eventReminder !== undefined) this._eventReminder = params.eventReminder;
    if (params.eventUpdated !== undefined) this._eventUpdated = params.eventUpdated;
    if (params.eventCancelled !== undefined) this._eventCancelled = params.eventCancelled;
    if (params.newAttendee !== undefined) this._newAttendee = params.newAttendee;
    if (params.attendeeRemoved !== undefined) this._attendeeRemoved = params.attendeeRemoved;
    if (params.systemNotifications !== undefined) this._systemNotifications = params.systemNotifications;
    
    this._updatedAt = new Date();
  }

  /**
   * Valida los datos de la entidad
   * @throws Error si los datos no son válidos
   */
  private validate(): void {
    if (!this._userId || this._userId.trim().length === 0) {
      throw new Error('El ID de usuario es requerido');
    }
  }
} 