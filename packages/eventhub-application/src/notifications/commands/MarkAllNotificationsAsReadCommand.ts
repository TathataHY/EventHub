import { NotificationRepository } from '../repositories/NotificationRepository';
import { Command } from '../../core/interfaces/Command';

export class MarkAllNotificationsAsReadCommand implements Command<string, void> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta el comando para marcar todas las notificaciones de un usuario como leídas
   */
  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    await this.notificationRepository.markAllAsRead(userId);
  }
} 