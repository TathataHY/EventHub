// Tipos de notificaciones que puede recibir un usuario
export enum NotificationType {
  EVENT_INVITE = 'EVENT_INVITE',
  EVENT_REMINDER = 'EVENT_REMINDER',
  EVENT_UPDATE = 'EVENT_UPDATE',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  NEW_COMMENT = 'NEW_COMMENT',
  FRIEND_ATTENDING = 'FRIEND_ATTENDING',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
}

// Interface para el objeto de notificación
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    eventId?: string;
    eventName?: string;
    commentId?: string;
    userId?: string;
    userName?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
}

// Parámetros para marcar notificaciones como leídas
export interface MarkAsReadParams {
  notificationId?: string; // Si se especifica, solo se marca esta notificación
  allNotifications?: boolean; // Si es true, se marcan todas las notificaciones
} 