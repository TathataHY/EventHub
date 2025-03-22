import { Notification } from '@eventhub/domain/dist/notifications/entities/Notification';
import { NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Command } from '../../core/interfaces/Command';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotFoundException, ValidationException, ExternalServiceException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { NotificationPreferenceRepository } from '../repositories/NotificationPreferenceRepository';
import { NotificationChannel, NotificationType } from './UpdateNotificationPreferenceCommand';
import { CreateNotificationCommand } from './CreateNotificationCommand';

/**
 * Interfaz para servicios de notificación externos
 */
export interface NotificationService {
  sendEmail(to: string, subject: string, content: string, templateId?: string, data?: any): Promise<boolean>;
  sendPush(userId: string, title: string, body: string, data?: any): Promise<boolean>;
  sendSms(phoneNumber: string, message: string): Promise<boolean>;
}

/**
 * Comando para enviar notificaciones a través de múltiples canales
 */
export class SendNotificationCommand implements Command<Record<string, boolean>> {
  constructor(
    private readonly userId: string,
    private readonly type: NotificationType,
    private readonly title: string,
    private readonly message: string,
    private readonly notificationService: NotificationService,
    private readonly userRepository: UserRepository,
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
    private readonly createNotificationCommand: CreateNotificationCommand,
    private readonly data?: any,
    private readonly entityId?: string,
    private readonly linkUrl?: string
  ) {}

  /**
   * Ejecuta el comando para enviar una notificación a través de múltiples canales
   * @returns Promise<Record<string, boolean>> Resultado del envío por cada canal
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el usuario no existe
   * @throws ExternalServiceException si hay problemas con los servicios de notificación
   */
  async execute(): Promise<Record<string, boolean>> {
    // Validación básica
    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    if (!this.type || !Object.values(NotificationType).includes(this.type)) {
      throw new ValidationException('Tipo de notificación inválido');
    }

    if (!this.title || this.title.trim().length === 0) {
      throw new ValidationException('El título de la notificación es requerido');
    }

    if (!this.message || this.message.trim().length === 0) {
      throw new ValidationException('El mensaje de la notificación es requerido');
    }

    // Obtener el usuario
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    // Obtener las preferencias de notificación del usuario
    let preference = await this.notificationPreferenceRepository.findByUserAndType(
      this.userId,
      this.type
    );

    // Si no hay preferencias específicas, usar valores predeterminados
    if (!preference) {
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

    // Si las notificaciones están desactivadas, no enviar nada
    if (!preference.enabled) {
      return {
        [NotificationChannel.EMAIL]: false,
        [NotificationChannel.PUSH]: false,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.IN_APP]: false
      };
    }

    const results: Record<string, boolean> = {};

    // Enviar notificaciones según las preferencias del usuario y los canales habilitados
    try {
      // Notificación por email
      if (preference.channels[NotificationChannel.EMAIL]) {
        results[NotificationChannel.EMAIL] = await this.sendEmail(user.email);
      } else {
        results[NotificationChannel.EMAIL] = false;
      }

      // Notificación push
      if (preference.channels[NotificationChannel.PUSH]) {
        results[NotificationChannel.PUSH] = await this.sendPush();
      } else {
        results[NotificationChannel.PUSH] = false;
      }

      // Notificación por SMS
      if (preference.channels[NotificationChannel.SMS] && user.phoneNumber) {
        results[NotificationChannel.SMS] = await this.sendSms(user.phoneNumber);
      } else {
        results[NotificationChannel.SMS] = false;
      }

      // Notificación en la aplicación
      if (preference.channels[NotificationChannel.IN_APP]) {
        results[NotificationChannel.IN_APP] = await this.createInAppNotification();
      } else {
        results[NotificationChannel.IN_APP] = false;
      }

      return results;
    } catch (error) {
      throw new ExternalServiceException('Servicio de Notificación', error.message);
    }
  }

  /**
   * Envía una notificación por email
   */
  private async sendEmail(email: string): Promise<boolean> {
    try {
      return await this.notificationService.sendEmail(
        email,
        this.title,
        this.message,
        `notification-${this.type}`,
        {
          title: this.title,
          message: this.message,
          data: this.data,
          linkUrl: this.linkUrl
        }
      );
    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Envía una notificación push
   */
  private async sendPush(): Promise<boolean> {
    try {
      return await this.notificationService.sendPush(
        this.userId,
        this.title,
        this.message,
        {
          type: this.type,
          entityId: this.entityId,
          linkUrl: this.linkUrl,
          data: this.data
        }
      );
    } catch (error) {
      console.error('Error al enviar notificación push:', error);
      return false;
    }
  }

  /**
   * Envía una notificación por SMS
   */
  private async sendSms(phoneNumber: string): Promise<boolean> {
    try {
      // Simplificar mensaje para SMS
      const smsMessage = `${this.title}: ${this.message}`;
      return await this.notificationService.sendSms(phoneNumber, smsMessage);
    } catch (error) {
      console.error('Error al enviar SMS:', error);
      return false;
    }
  }

  /**
   * Crea una notificación en la aplicación
   */
  private async createInAppNotification(): Promise<boolean> {
    try {
      // Usamos el comando existente para crear la notificación
      const notificationId = await this.createNotificationCommand.execute();
      return !!notificationId;
    } catch (error) {
      console.error('Error al crear notificación en la aplicación:', error);
      return false;
    }
  }
} 