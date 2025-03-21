import { NotificationDTO, CreateNotificationDTO, MarkNotificationReadDTO, NotificationType } from '../dtos/NotificationDTO';
import { CreateNotificationCommand } from '../commands/CreateNotificationCommand';
import { MarkNotificationReadCommand } from '../commands/MarkNotificationReadCommand';
import { MarkAllNotificationsReadCommand } from '../commands/MarkAllNotificationsReadCommand';
import { DeleteNotificationCommand } from '../commands/DeleteNotificationCommand';
import { DeleteAllReadNotificationsCommand } from '../commands/DeleteAllReadNotificationsCommand';
import { GetUserNotificationsQuery } from '../queries/GetUserNotificationsQuery';
import { GetUserUnreadNotificationsQuery } from '../queries/GetUserUnreadNotificationsQuery';
import { GetUserUnreadNotificationCountQuery } from '../queries/GetUserUnreadNotificationCountQuery';
import { GetUserNotificationsByTypeQuery } from '../queries/GetUserNotificationsByTypeQuery';
import { NotificationRepository } from '@eventhub/domain/dist/notifications/repositories/NotificationRepository';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { UserRepositoryAdapter } from '../../users/adapters/UserRepositoryAdapter';

export class NotificationService {
  private readonly notificationRepositoryAdapter: NotificationRepositoryAdapter;
  private readonly notificationMapper: NotificationMapper;
  
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepositoryAdapter: UserRepositoryAdapter
  ) {
    this.notificationRepositoryAdapter = new NotificationRepositoryAdapter(notificationRepository);
    this.notificationMapper = new NotificationMapper();
  }

  /**
   * Crea una nueva notificación
   */
  async createNotification(data: CreateNotificationDTO): Promise<NotificationDTO> {
    const command = new CreateNotificationCommand(
      this.notificationRepositoryAdapter,
      this.userRepositoryAdapter,
      data
    );
    return await command.execute();
  }

  /**
   * Marca una notificación como leída o no leída
   */
  async markNotificationRead(id: string, data: MarkNotificationReadDTO): Promise<NotificationDTO> {
    const command = new MarkNotificationReadCommand(
      this.notificationRepositoryAdapter,
      id,
      data.read
    );
    return await command.execute();
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas
   */
  async markAllNotificationsRead(userId: string): Promise<void> {
    const command = new MarkAllNotificationsReadCommand(
      this.notificationRepositoryAdapter,
      userId
    );
    await command.execute();
  }

  /**
   * Elimina una notificación
   */
  async deleteNotification(id: string): Promise<void> {
    const command = new DeleteNotificationCommand(
      this.notificationRepositoryAdapter,
      id
    );
    await command.execute();
  }

  /**
   * Elimina todas las notificaciones leídas de un usuario
   */
  async deleteAllReadNotifications(userId: string): Promise<void> {
    const command = new DeleteAllReadNotificationsCommand(
      this.notificationRepositoryAdapter,
      userId
    );
    await command.execute();
  }

  /**
   * Obtiene todas las notificaciones de un usuario
   */
  async getUserNotifications(userId: string): Promise<NotificationDTO[]> {
    const query = new GetUserNotificationsQuery(
      this.notificationRepositoryAdapter,
      this.notificationMapper,
      userId
    );
    return await query.execute();
  }

  /**
   * Obtiene las notificaciones no leídas de un usuario
   */
  async getUserUnreadNotifications(userId: string): Promise<NotificationDTO[]> {
    const query = new GetUserUnreadNotificationsQuery(
      this.notificationRepositoryAdapter,
      this.notificationMapper,
      userId
    );
    return await query.execute();
  }

  /**
   * Obtiene el conteo de notificaciones no leídas de un usuario
   */
  async getUserUnreadNotificationCount(userId: string): Promise<number> {
    const query = new GetUserUnreadNotificationCountQuery(
      this.notificationRepositoryAdapter,
      userId
    );
    return await query.execute();
  }

  /**
   * Obtiene las notificaciones de un usuario por tipo
   */
  async getUserNotificationsByType(userId: string, type: NotificationType): Promise<NotificationDTO[]> {
    const query = new GetUserNotificationsByTypeQuery(
      this.notificationRepositoryAdapter,
      this.notificationMapper,
      userId,
      type
    );
    return await query.execute();
  }
} 