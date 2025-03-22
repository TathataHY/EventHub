/**
 * Opciones para enviar una notificación a través de un canal
 */
export interface SendNotificationOptions {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, any>;
}

/**
 * Respuesta del envío de una notificación
 */
export interface NotificationSendResult {
  success: boolean;
  channelId: string;
  recipientId: string;
  messageId?: string;
  error?: string;
}

/**
 * Interfaz para adaptadores de canales de notificación
 */
export interface INotificationChannelAdapter {
  /**
   * Identificador único del canal de notificación
   */
  readonly channelId: string;
  
  /**
   * Envía una notificación a través del canal
   */
  sendNotification(options: SendNotificationOptions): Promise<NotificationSendResult>;
} 