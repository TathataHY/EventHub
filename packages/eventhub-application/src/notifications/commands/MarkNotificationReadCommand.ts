import { Command } from '../../core/interfaces/Command';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { NotificationDTO, MarkNotificationReadDTO } from '../dtos/NotificationDTO';

/**
 * Parámetros para marcar una notificación como leída/no leída
 */
interface MarkNotificationReadParams {
  id: string;
  read: boolean;
}

/**
 * Comando para marcar una notificación como leída o no leída
 */
export class MarkNotificationReadCommand implements Command<MarkNotificationReadParams, NotificationDTO> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private notificationId?: string,
    private read?: boolean
  ) {}

  /**
   * Ejecuta el comando para marcar una notificación como leída/no leída
   * @param params Objeto con el id de la notificación y el estado read
   * @returns NotificationDTO con la notificación actualizada
   * @throws ValidationException si hay problemas de validación
   */
  async execute(params?: MarkNotificationReadParams): Promise<NotificationDTO> {
    const id = params?.id || this.notificationId;
    const read = params?.read !== undefined ? params.read : this.read;
    
    if (!id) {
      throw new Error('Se requiere un ID de notificación');
    }
    
    if (read === undefined) {
      throw new Error('Se requiere el estado read');
    }
    
    // Verificar que la notificación existe
    const notification = await this.notificationRepository.findById(id);
    
    if (!notification) {
      throw new ValidationException('La notificación no existe');
    }
    
    // Si el estado actual ya es el mismo que queremos establecer, no hacemos nada
    if (notification.read === read) {
      return notification;
    }
    
    // Marcar como leída/no leída
    await this.notificationRepository.markAsRead(id, read);
    
    // Recuperar la notificación actualizada
    const updatedNotification = await this.notificationRepository.findById(id);
    
    return updatedNotification;
  }
} 