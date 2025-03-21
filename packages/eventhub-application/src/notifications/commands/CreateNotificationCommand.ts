import { Command } from '../../core/interfaces/Command';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { NotificationRepositoryAdapter } from '../adapters/NotificationRepositoryAdapter';
import { CreateNotificationDTO, NotificationType, NotificationChannel, NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationAdapter } from '../adapters/NotificationAdapter';
import { UserRepositoryAdapter } from '../../users/adapters/UserRepositoryAdapter';

/**
 * Comando para crear una notificación
 */
export class CreateNotificationCommand implements Command<CreateNotificationDTO, NotificationDTO> {
  constructor(
    private notificationRepository: NotificationRepositoryAdapter,
    private userRepository: UserRepositoryAdapter,
    private notificationData?: CreateNotificationDTO
  ) {}

  /**
   * Ejecuta el comando para crear una notificación
   * @param params Datos para crear la notificación
   * @returns NotificationDTO con la notificación creada
   * @throws ValidationException si hay problemas de validación
   */
  async execute(params?: CreateNotificationDTO): Promise<NotificationDTO> {
    const data = params || this.notificationData;
    
    if (!data) {
      throw new Error('Se requieren datos para crear la notificación');
    }

    // Validación básica
    await this.validateNotificationData(data);

    // Crear la notificación
    const notification = {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      html: data.html,
      channel: data.channel || NotificationChannel.APP,
      read: false,
      sent: false,
      priority: data.priority || 'medium',
      relatedEntityId: data.relatedEntityId,
      relatedEntityType: data.relatedEntityType,
      data: data.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    // Guardar la notificación
    const notificationId = await this.notificationRepository.create(notification);
    
    // Obtener la notificación creada
    const createdNotification = await this.notificationRepository.findById(notificationId);
    
    // Devolver la notificación como DTO
    return createdNotification;
  }
  
  /**
   * Valida los datos de la notificación
   */
  private async validateNotificationData(data: CreateNotificationDTO): Promise<void> {
    if (!data.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    if (!data.type) {
      throw new ValidationException('Tipo de notificación es requerido');
    }

    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationException('El título de la notificación es requerido');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new ValidationException('El mensaje de la notificación es requerido');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new ValidationException(`El usuario con ID ${data.userId} no existe`);
    }
  }
} 