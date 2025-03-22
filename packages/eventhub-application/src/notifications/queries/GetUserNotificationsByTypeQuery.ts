import { Query } from '../../core/interfaces/Query';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotificationDTO, NotificationType } from '../dtos/NotificationDTO';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Parámetros para obtener notificaciones por tipo
 */
interface GetNotificationsByTypeParams {
  userId: string;
  type: NotificationType;
}

/**
 * Consulta para obtener las notificaciones de un usuario por tipo
 */
export class GetUserNotificationsByTypeQuery implements Query<GetNotificationsByTypeParams, NotificationDTO[]> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private notificationMapper: NotificationMapper,
    private userId?: string,
    private type?: NotificationType
  ) {}

  /**
   * Ejecuta la consulta para obtener las notificaciones de un usuario por tipo
   * @param params Objeto con el userId y type, opcional si se proporcionaron en el constructor
   * @returns Promise<NotificationDTO[]> Lista de notificaciones del usuario del tipo especificado
   * @throws ValidationException si hay problemas de validación
   */
  async execute(params?: GetNotificationsByTypeParams): Promise<NotificationDTO[]> {
    const targetUserId = params?.userId || this.userId;
    const targetType = params?.type || this.type;
    
    if (!targetUserId) {
      throw new ValidationException('Se requiere un ID de usuario');
    }
    
    if (!targetType) {
      throw new ValidationException('Se requiere un tipo de notificación');
    }
    
    // Obtener notificaciones del usuario por tipo
    const notifications = await this.notificationRepository.findByUserIdAndType(targetUserId, targetType);
    
    // Convertir a DTOs y devolver
    return notifications.map(notification => this.notificationMapper.toDTO(notification));
  }
} 