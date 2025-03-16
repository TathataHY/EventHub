import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'eventhub-domain';

/**
 * Caso de uso para marcar todas las notificaciones de un usuario como leídas
 */
@Injectable()
export class MarkAllNotificationsReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  /**
   * Marca todas las notificaciones de un usuario como leídas
   * @param userId ID del usuario
   * @returns Cantidad de notificaciones marcadas como leídas
   */
  async execute(userId: string): Promise<{ count: number }> {
    // Buscar todas las notificaciones no leídas del usuario
    const unreadCount = await this.notificationRepository.countUnread(userId);
    
    // Marcar todas como leídas
    if (unreadCount > 0) {
      await this.notificationRepository.markAllAsRead(userId);
    }
    
    return { count: unreadCount };
  }
} 