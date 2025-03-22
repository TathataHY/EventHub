import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Canales de notificación disponibles en el sistema
 */
export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
  IN_APP = 'in_app',
  SMS = 'sms'
}

/**
 * Configuración de canales de notificación
 */
export interface ChannelConfiguration {
  enabled: boolean;
  settings?: Record<string, any>;
} 