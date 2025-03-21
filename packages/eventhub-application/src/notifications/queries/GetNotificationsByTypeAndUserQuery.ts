import { NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

interface TypeAndUserParams {
  type: string;
  userId: string;
}

export class GetNotificationsByTypeAndUserQuery implements Query<TypeAndUserParams, NotificationDTO[]> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta la consulta para obtener las notificaciones por tipo y usuario
   */
  async execute({ type, userId }: TypeAndUserParams): Promise<NotificationDTO[]> {
    if (!type) {
      throw new Error('El tipo de notificación es requerido');
    }

    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    const notifications = await this.notificationRepository.findByTypeAndUserId(type, userId);
    return NotificationMapper.toDTOList(notifications);
  }
} 