// Tipos para el módulo de notificaciones

// Tipo de notificación
export enum NotificationType {
  EVENT_REMINDER = 'EVENT_REMINDER',
  EVENT_INVITATION = 'EVENT_INVITATION',
  EVENT_UPDATE = 'EVENT_UPDATE',
  EVENT_CANCELLATION = 'EVENT_CANCELLATION',
  EVENT_COMMENT = 'EVENT_COMMENT',
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
  TICKET_CONFIRMATION = 'TICKET_CONFIRMATION',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

// Estado de notificación
export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  DELETED = 'DELETED',
}

// Datos de la notificación
export interface NotificationData {
  eventId?: string;
  userId?: string;
  achievementId?: string;
  ticketId?: string;
  commentId?: string;
  message?: string;
  entity?: any;
  [key: string]: any;
}

// Modelo de notificación
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  status: NotificationStatus;
  createdAt: string;
  expiresAt?: string;
}

// Configuración de notificaciones
export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  eventReminders: boolean;
  eventInvitations: boolean;
  eventUpdates: boolean;
  followRequests: boolean;
  newFollowers: boolean;
  achievementUnlocks: boolean;
  ticketConfirmations: boolean;
  systemMessages: boolean;
}

// Preferencias de tiempo para recordatorios
export interface ReminderPreferences {
  eventReminderTime: number; // Horas antes del evento
  eventCheckInTime: boolean; // Recordatorio cuando sea hora de hacer check-in
}

// Token de dispositivo para notificaciones push
export interface DeviceToken {
  id?: string;
  userId: string;
  token: string;
  device: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: string;
} 