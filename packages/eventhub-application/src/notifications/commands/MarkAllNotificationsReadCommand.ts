import { Command } from '../../core/interfaces/Command';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Comando para marcar todas las notificaciones de un usuario como leídas
 */
export class MarkAllNotificationsReadCommand implements Command<string, void> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private userId?: string
  ) {}

  /**
   * Ejecuta el comando para marcar todas las notificaciones de un usuario como leídas
   * @param userId ID del usuario, opcional si se proporcionó en el constructor
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   */
  async execute(userId?: string): Promise<void> {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      throw new ValidationException('Se requiere un ID de usuario');
    }
    
    // Marcar todas las notificaciones del usuario como leídas
    await this.notificationRepository.markAllAsReadByUserId(targetUserId);
  }
} 