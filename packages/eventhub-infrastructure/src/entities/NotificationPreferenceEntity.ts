/**
 * Entidad ORM para preferencias de notificaciones
 * Representa la estructura de la tabla de preferencias de notificaciones en la base de datos
 */
export class NotificationPreferenceEntity {
  id: string;
  userId: string;
  
  // Canales de notificación
  inApp: boolean;
  email: boolean;
  push: boolean;
  
  // Tipos de notificaciones
  eventReminder: boolean;
  eventUpdated: boolean;
  eventCancelled: boolean;
  newAttendee: boolean;
  attendeeCancelled: boolean;
  systemNotification: boolean;
  
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    inApp: boolean;
    email: boolean;
    push: boolean;
    eventReminder: boolean;
    eventUpdated: boolean;
    eventCancelled: boolean;
    newAttendee: boolean;
    attendeeCancelled: boolean;
    systemNotification: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.inApp = params.inApp;
    this.email = params.email;
    this.push = params.push;
    this.eventReminder = params.eventReminder;
    this.eventUpdated = params.eventUpdated;
    this.eventCancelled = params.eventCancelled;
    this.newAttendee = params.newAttendee;
    this.attendeeCancelled = params.attendeeCancelled;
    this.systemNotification = params.systemNotification;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
} 