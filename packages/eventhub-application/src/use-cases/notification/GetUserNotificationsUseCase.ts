import { NotificationRepository, FindNotificationsOptions } from 'eventhub-domain';
import { NotificationDto } from '../../dto/notification/NotificationDto';

/**
 * Caso de uso para obtener las notificaciones de un usuario
 */
export class GetUserNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param userId ID del usuario
   * @param options Opciones de paginación y filtrado
   * @returns Lista de notificaciones y total
   */
  async execute(userId: string, options: FindNotificationsOptions): Promise<{
    notifications: NotificationDto[];
    total: number;
  }> {
    const result = await this.notificationRepository.findByUserId(userId, options);

    // Mapear a DTOs para retornar
    const notificationDtos = result.notifications.map(notification => ({
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));

    return {
      notifications: notificationDtos,
      total: result.total
    };
  }
} 