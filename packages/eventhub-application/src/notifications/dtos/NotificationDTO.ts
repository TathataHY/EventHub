/**
 * Tipos de notificación soportados
 */
export enum NotificationType {
  EVENT_INVITATION = 'event_invitation',
  EVENT_REMINDER = 'event_reminder',
  EVENT_CANCELLED = 'event_cancelled',
  EVENT_UPDATED = 'event_updated',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  PAYMENT_FAILED = 'payment_failed',
  GROUP_INVITATION = 'group_invitation',
  NEW_MESSAGE = 'new_message',
  SYSTEM_ALERT = 'system_alert'
}

/**
 * Canales de notificación soportados
 */
export enum NotificationChannel {
  APP = 'app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push'
}

/**
 * DTO para una notificación en la capa de aplicación
 */
export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  html?: string;
  type: string;
  channel: string;
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
  isActive: boolean;
}

/**
 * DTO para crear una notificación
 */
export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  html?: string;
  type: string;
  channel?: string;
  priority?: 'low' | 'medium' | 'high';
  relatedEntityId?: string;
  relatedEntityType?: string;
  data?: Record<string, any>;
}

/**
 * DTO para marcar una notificación como leída/no leída
 */
export interface MarkNotificationReadDTO {
  read: boolean;
}

/**
 * Opciones para buscar notificaciones
 */
export interface FindNotificationsOptionsDTO {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

/**
 * Resultado paginado de notificaciones
 */
export interface PaginatedNotificationsResultDTO {
  notifications: NotificationDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 