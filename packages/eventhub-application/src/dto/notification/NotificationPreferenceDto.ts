/**
 * DTO para la representación de preferencias de notificaciones
 */
export interface NotificationPreferenceDto {
  /**
   * ID de las preferencias de notificación
   */
  id: string;

  /**
   * ID del usuario
   */
  userId: string;

  /**
   * Notificaciones en la aplicación
   */
  inApp: boolean;

  /**
   * Notificaciones por email
   */
  email: boolean;

  /**
   * Notificaciones push
   */
  push: boolean;

  /**
   * Notificaciones de recordatorio de eventos
   */
  eventReminder: boolean;

  /**
   * Notificaciones de eventos actualizados
   */
  eventUpdated: boolean;

  /**
   * Notificaciones de eventos cancelados
   */
  eventCancelled: boolean;

  /**
   * Notificaciones de nuevos asistentes
   */
  newAttendee: boolean;

  /**
   * Notificaciones de asistentes cancelados
   */
  attendeeCancelled: boolean;

  /**
   * Notificaciones del sistema
   */
  systemNotification: boolean;

  /**
   * Fecha de creación
   */
  createdAt: Date | string;

  /**
   * Fecha de última actualización
   */
  updatedAt: Date | string;
} 