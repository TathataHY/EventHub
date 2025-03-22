import { NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

export class GetNotificationsByTypeQuery implements Query<string, NotificationDTO[]> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta la consulta para obtener las notificaciones por tipo
   */
  async execute(type: string): Promise<NotificationDTO[]> {
    if (!type) {
      throw new Error('El tipo de notificación es requerido');
    }

    const notifications = await this.notificationRepository.findByType(type);
    return NotificationMapper.toDTOList(notifications);
  }
} 