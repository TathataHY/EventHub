import { UserRepository } from '../../users/repositories/UserRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException } from '../../core/exceptions';
import { NotificationPreferenceRepository } from '../repositories/NotificationPreferenceRepository';

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
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app'
}

/**
 * Interfaz para una preferencia de notificación
 */
export interface NotificationPreference {
  userId: string;
  type: NotificationType;
  channels: Record<NotificationChannel, boolean>;
  enabled: boolean;
  updatedAt: Date;
}

/**
 * Comando para actualizar preferencias de notificación
 */
export class UpdateNotificationPreferenceCommand implements Command<boolean> {
  constructor(
    private readonly userId: string,
    private readonly type: NotificationType,
    private readonly userRepository: UserRepository,
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
    private readonly channels?: Record<NotificationChannel, boolean>,
    private readonly enabled?: boolean
  ) {}

  /**
   * Ejecuta el comando para actualizar una preferencia de notificación
   * @returns Promise<boolean> Resultado de la operación
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el usuario no existe
   */
  async execute(): Promise<boolean> {
    // Validación básica
    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    if (!this.type || !Object.values(NotificationType).includes(this.type)) {
      throw new ValidationException('Tipo de notificación inválido');
    }

    if (this.channels === undefined && this.enabled === undefined) {
      throw new ValidationException('Se debe proporcionar al menos canales o estado de habilitación');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    // Obtener la preferencia actual o crear una nueva
    let preference = await this.notificationPreferenceRepository.findByUserAndType(
      this.userId,
      this.type
    );

    if (!preference) {
      // Si no existe, creamos una preferencia por defecto
      preference = {
        userId: this.userId,
        type: this.type,
        channels: {
          [NotificationChannel.EMAIL]: true,
          [NotificationChannel.PUSH]: true,
          [NotificationChannel.SMS]: false,
          [NotificationChannel.IN_APP]: true
        },
        enabled: true,
        updatedAt: new Date()
      };
    }

    // Actualizar canales si se proporcionaron
    if (this.channels) {
      preference.channels = {
        ...preference.channels,
        ...this.channels
      };
    }

    // Actualizar estado de habilitación si se proporcionó
    if (this.enabled !== undefined) {
      preference.enabled = this.enabled;
    }

    // Actualizar fecha de modificación
    preference.updatedAt = new Date();

    // Guardar la preferencia actualizada
    const success = await this.notificationPreferenceRepository.save(preference);

    return success;
  }
} 