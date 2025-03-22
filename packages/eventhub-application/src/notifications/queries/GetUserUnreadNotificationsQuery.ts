import { Query } from '../../core/interfaces/Query';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationDTO } from '../dtos/NotificationDTO';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Consulta para obtener las notificaciones no leídas de un usuario
 */
export class GetUserUnreadNotificationsQuery implements Query<string, NotificationDTO[]> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private notificationMapper: NotificationMapper,
    private userId?: string
  ) {}

  /**
   * Ejecuta la consulta para obtener las notificaciones no leídas de un usuario
   * @param userId ID del usuario, opcional si se proporcionó en el constructor
   * @returns Promise<NotificationDTO[]> Lista de notificaciones no leídas del usuario
   * @throws ValidationException si hay problemas de validación
   */
  async execute(userId?: string): Promise<NotificationDTO[]> {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      throw new ValidationException('Se requiere un ID de usuario');
    }
    
    // Obtener notificaciones no leídas del usuario
    const notifications = await this.notificationRepository.findUnreadByUserId(targetUserId);
    
    // Convertir a DTOs y devolver
    return notifications.map(notification => this.notificationMapper.toDTO(notification));
  }
} 