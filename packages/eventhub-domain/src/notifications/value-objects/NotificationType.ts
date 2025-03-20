import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Tipos de notificaciones en el sistema
 */
export enum NotificationType {
  // Notificaciones del sistema
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  
  // Notificaciones de eventos
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  EVENT_CANCELLED = 'event_cancelled',
  EVENT_REMINDER = 'event_reminder',
  EVENT_STARTING_SOON = 'event_starting_soon',
  
  // Notificaciones de asistentes
  ATTENDEE_ADDED = 'attendee_added',
  ATTENDEE_REMOVED = 'attendee_removed',
  
  // Notificaciones de comentarios
  COMMENT_ADDED = 'comment_added',
  COMMENT_REPLIED = 'comment_replied',
  
  // Notificaciones de calificaciones
  RATING_ADDED = 'rating_added',
  
  // Recordatorios
  REMINDER = 'reminder'
}

/**
 * Información adicional sobre los tipos de notificación
 */
export interface NotificationTypeInfo {
  type: NotificationType;
  displayName: string;
  description: string;
  defaultChannel: string[];
  priority: 'low' | 'medium' | 'high';
}

/**
 * Información detallada de cada tipo de notificación
 */
export const notificationTypeDetails: Record<NotificationType, NotificationTypeInfo> = {
  [NotificationType.INFO]: {
    type: NotificationType.INFO,
    displayName: 'Información',
    description: 'Notificaciones informativas generales',
    defaultChannel: ['in_app'],
    priority: 'low'
  },
  [NotificationType.WARNING]: {
    type: NotificationType.WARNING,
    displayName: 'Advertencia',
    description: 'Advertencias y notificaciones importantes',
    defaultChannel: ['in_app'],
    priority: 'medium'
  },
  [NotificationType.ERROR]: {
    type: NotificationType.ERROR,
    displayName: 'Error',
    description: 'Mensajes de error que requieren atención',
    defaultChannel: ['in_app', 'email'],
    priority: 'high'
  },
  [NotificationType.SUCCESS]: {
    type: NotificationType.SUCCESS,
    displayName: 'Éxito',
    description: 'Confirmaciones de acciones exitosas',
    defaultChannel: ['in_app'],
    priority: 'low'
  },
  [NotificationType.EVENT_CREATED]: {
    type: NotificationType.EVENT_CREATED,
    displayName: 'Evento creado',
    description: 'Un nuevo evento ha sido creado',
    defaultChannel: ['in_app', 'email'],
    priority: 'medium'
  },
  [NotificationType.EVENT_UPDATED]: {
    type: NotificationType.EVENT_UPDATED,
    displayName: 'Evento actualizado',
    description: 'Un evento ha sido actualizado',
    defaultChannel: ['in_app', 'email'],
    priority: 'medium'
  },
  [NotificationType.EVENT_CANCELLED]: {
    type: NotificationType.EVENT_CANCELLED,
    displayName: 'Evento cancelado',
    description: 'Un evento ha sido cancelado',
    defaultChannel: ['in_app', 'email', 'push'],
    priority: 'high'
  },
  [NotificationType.EVENT_REMINDER]: {
    type: NotificationType.EVENT_REMINDER,
    displayName: 'Recordatorio de evento',
    description: 'Recordatorio de evento próximo',
    defaultChannel: ['in_app', 'email', 'push'],
    priority: 'medium'
  },
  [NotificationType.EVENT_STARTING_SOON]: {
    type: NotificationType.EVENT_STARTING_SOON,
    displayName: 'Evento a punto de comenzar',
    description: 'Un evento está a punto de comenzar',
    defaultChannel: ['in_app', 'push'],
    priority: 'high'
  },
  [NotificationType.ATTENDEE_ADDED]: {
    type: NotificationType.ATTENDEE_ADDED,
    displayName: 'Nuevo asistente',
    description: 'Un nuevo asistente se ha unido al evento',
    defaultChannel: ['in_app'],
    priority: 'low'
  },
  [NotificationType.ATTENDEE_REMOVED]: {
    type: NotificationType.ATTENDEE_REMOVED,
    displayName: 'Asistente eliminado',
    description: 'Un asistente ha dejado el evento',
    defaultChannel: ['in_app'],
    priority: 'low'
  },
  [NotificationType.COMMENT_ADDED]: {
    type: NotificationType.COMMENT_ADDED,
    displayName: 'Nuevo comentario',
    description: 'Un nuevo comentario ha sido añadido a su evento',
    defaultChannel: ['in_app'],
    priority: 'low'
  },
  [NotificationType.COMMENT_REPLIED]: {
    type: NotificationType.COMMENT_REPLIED,
    displayName: 'Respuesta a comentario',
    description: 'Alguien ha respondido a su comentario',
    defaultChannel: ['in_app', 'email'],
    priority: 'medium'
  },
  [NotificationType.RATING_ADDED]: {
    type: NotificationType.RATING_ADDED,
    displayName: 'Nueva calificación',
    description: 'Su evento ha recibido una nueva calificación',
    defaultChannel: ['in_app'],
    priority: 'low'
  },
  [NotificationType.REMINDER]: {
    type: NotificationType.REMINDER,
    displayName: 'Recordatorio',
    description: 'Recordatorio general',
    defaultChannel: ['in_app', 'email'],
    priority: 'medium'
  }
}; 