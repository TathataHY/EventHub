/**
 * Tipos de notificaciones en el sistema
 */
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  EVENT_CANCELLED = 'event_cancelled',
  ATTENDEE_ADDED = 'attendee_added',
  ATTENDEE_REMOVED = 'attendee_removed',
  REMINDER = 'reminder'
} 