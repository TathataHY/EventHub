import { Query } from '../../core/interfaces/Query';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Consulta para obtener el conteo de notificaciones no leídas de un usuario
 */
export class GetUserUnreadNotificationCountQuery implements Query<string, number> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private userId?: string
  ) {}

  /**
   * Ejecuta la consulta para obtener el conteo de notificaciones no leídas
   * @param userId ID del usuario, opcional si se proporcionó en el constructor
   * @returns Promise<number> Número de notificaciones no leídas
   * @throws ValidationException si hay problemas de validación
   */
  async execute(userId?: string): Promise<number> {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      throw new ValidationException('Se requiere un ID de usuario');
    }
    
    // Obtener conteo de notificaciones no leídas
    return await this.notificationRepository.countUnreadByUserId(targetUserId);
  }
} 