import { NotificationRepository } from '../repositories/NotificationRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

export class GetUnreadCountQuery implements Query<string, number> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta la consulta para obtener el conteo de notificaciones no leídas de un usuario
   */
  async execute(userId: string): Promise<number> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    return this.notificationRepository.getUnreadCount(userId);
  }
} 