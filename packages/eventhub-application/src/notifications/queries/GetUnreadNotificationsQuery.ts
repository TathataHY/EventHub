import { NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

export class GetUnreadNotificationsQuery implements Query<string, NotificationDTO[]> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta la consulta para obtener las notificaciones no leídas de un usuario
   */
  async execute(userId: string): Promise<NotificationDTO[]> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    const notifications = await this.notificationRepository.findUnreadByUserId(userId);
    return NotificationMapper.toDTOList(notifications);
  }
} 