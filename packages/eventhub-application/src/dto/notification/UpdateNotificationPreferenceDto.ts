/**
 * DTO para actualizar preferencias de notificaciones
 */
export interface UpdateNotificationPreferenceDto {
  /**
   * Activar/desactivar notificaciones en la aplicación
   */
  inApp?: boolean;

  /**
   * Activar/desactivar notificaciones por email
   */
  email?: boolean;

  /**
   * Activar/desactivar notificaciones push
   */
  push?: boolean;

  /**
   * Activar/desactivar notificaciones de recordatorio de eventos
   */
  eventReminder?: boolean;

  /**
   * Activar/desactivar notificaciones de eventos actualizados
   */
  eventUpdated?: boolean;

  /**
   * Activar/desactivar notificaciones de eventos cancelados
   */
  eventCancelled?: boolean;

  /**
   * Activar/desactivar notificaciones de nuevos asistentes
   */
  newAttendee?: boolean;

  /**
   * Activar/desactivar notificaciones de asistentes cancelados
   */
  attendeeCancelled?: boolean;

  /**
   * Activar/desactivar notificaciones del sistema
   */
  systemNotification?: boolean;
} 