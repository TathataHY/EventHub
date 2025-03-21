import { Notification } from '@eventhub/shared/domain/notifications/Notification';
import { NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';

export class GetNotificationQuery implements Query<string, NotificationDTO> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta la consulta para obtener una notificación por ID
   */
  async execute(id: string): Promise<NotificationDTO> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    return NotificationMapper.toDTO(notification);
  }
} 