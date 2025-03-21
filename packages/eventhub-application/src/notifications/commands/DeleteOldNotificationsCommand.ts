import { NotificationRepository } from '../repositories/NotificationRepository';
import { Command } from '../../core/interfaces/Command';

export class DeleteOldNotificationsCommand implements Command<{ userId: string; daysOld: number }, void> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta el comando para eliminar las notificaciones antiguas de un usuario
   */
  async execute({ userId, daysOld }: { userId: string; daysOld: number }): Promise<void> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    if (daysOld < 0) {
      throw new Error('El número de días debe ser positivo');
    }

    await this.notificationRepository.deleteOldNotifications(userId, daysOld);
  }
} 