import { Command } from '../../core/interfaces/Command';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Comando para eliminar una notificación
 */
export class DeleteNotificationCommand implements Command<string, void> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private notificationId?: string
  ) {}

  /**
   * Ejecuta el comando para eliminar una notificación
   * @param id ID de la notificación, opcional si se proporcionó en el constructor
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   */
  async execute(id?: string): Promise<void> {
    const notificationId = id || this.notificationId;
    
    if (!notificationId) {
      throw new ValidationException('Se requiere un ID de notificación');
    }
    
    // Verificar que la notificación existe
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new ValidationException(`La notificación con ID ${notificationId} no existe`);
    }
    
    // Eliminar la notificación
    await this.notificationRepository.delete(notificationId);
  }
} 