import { Notification } from '@eventhub/domain/dist/notifications/entities/Notification';
import { UpdateNotificationDTO } from '../dtos/NotificationDTO';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { Command } from '../../core/interfaces/Command';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class UpdateNotificationCommand implements Command<{ id: string; data: UpdateNotificationDTO }, Notification> {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Ejecuta el comando para actualizar una notificación existente
   */
  async execute({ id, data }: { id: string; data: UpdateNotificationDTO }): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    this.validateUpdateData(data);

    const update = NotificationMapper.toPartialDomain(data);
    Object.assign(notification, update);

    return this.notificationRepository.save(notification);
  }

  /**
   * Valida los datos de actualización
   */
  private validateUpdateData(data: UpdateNotificationDTO): void {
    if (data.isRead !== undefined && typeof data.isRead !== 'boolean') {
      throw new Error('El estado de lectura debe ser un booleano');
    }
  }
} 