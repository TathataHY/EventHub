import { Notification, NotificationRepository, NotificationType, NotificationPreferenceRepository } from 'eventhub-domain';
import { CreateNotificationDto } from '../../dto/notification/CreateNotificationDto';
import { NotificationDto } from '../../dto/notification/NotificationDto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de uso para crear una notificación
 */
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly preferenceRepository: NotificationPreferenceRepository
  ) {}

  /**
   * Ejecuta el caso de uso
   * @param dto DTO con los datos para crear la notificación
   * @returns DTO con los datos de la notificación creada
   */
  async execute(dto: CreateNotificationDto): Promise<NotificationDto> {
    // Primero verificamos si el usuario tiene habilitado este tipo de notificación
    const preferences = await this.preferenceRepository.findByUserId(dto.userId);
    
    if (preferences && !preferences.isTypeEnabled(dto.type)) {
      throw new Error(`User has disabled notifications of type ${dto.type}`);
    }

    // Crear entidad de dominio
    const notification = new Notification({
      id: uuidv4(),
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data,
      isRead: false
    });

    // Persistir en el repositorio
    const savedNotification = await this.notificationRepository.create(notification);

    // Mapear a DTO para retornar
    return {
      id: savedNotification.id,
      userId: savedNotification.userId,
      type: savedNotification.type,
      title: savedNotification.title,
      message: savedNotification.message,
      data: savedNotification.data,
      isRead: savedNotification.isRead,
      createdAt: savedNotification.createdAt,
      updatedAt: savedNotification.updatedAt,
    };
  }
} 