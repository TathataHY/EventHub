import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'eventhub-domain';

/**
 * Caso de uso para obtener el número de notificaciones no leídas de un usuario
 */
@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  /**
   * Cuenta el número de notificaciones no leídas de un usuario
   * @param userId ID del usuario
   * @returns Número de notificaciones no leídas
   */
  async execute(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.countUnread(userId);
    return { count };
  }
} 