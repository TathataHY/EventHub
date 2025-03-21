import { Command } from '../../core/interfaces/Command';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Comando para eliminar todas las notificaciones leídas de un usuario
 */
export class DeleteAllReadNotificationsCommand implements Command<string, void> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private userId?: string
  ) {}

  /**
   * Ejecuta el comando para eliminar todas las notificaciones leídas de un usuario
   * @param userId ID del usuario, opcional si se proporcionó en el constructor
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   */
  async execute(userId?: string): Promise<void> {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      throw new ValidationException('Se requiere un ID de usuario');
    }
    
    // Eliminar todas las notificaciones leídas del usuario
    await this.notificationRepository.deleteReadByUserId(targetUserId);
  }
} 