import { Injectable } from '@nestjs/common';
import { Notification, NotificationRepository } from 'eventhub-domain';
import { NotificationDto } from '../../dtos/notification/NotificationDto';

/**
 * Caso de uso para marcar una notificación como leída
 */
@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  /**
   * Marca una notificación como leída
   * @param id ID de la notificación
   * @param userId ID del usuario dueño de la notificación
   * @returns La notificación actualizada
   */
  async execute(id: string, userId: string): Promise<NotificationDto> {
    // Buscar la notificación
    const notification = await this.notificationRepository.findById(id);
    
    // Verificar que la notificación existe
    if (!notification) {
      throw new Error('Notificación no encontrada');
    }
    
    // Verificar que el usuario es el dueño de la notificación
    if (notification.userId !== userId) {
      throw new Error('No tiene permiso para marcar esta notificación como leída');
    }
    
    // Marcar como leída si aún no lo está
    if (!notification.read) {
      notification.markAsRead();
      
      // Guardar la notificación actualizada
      await this.notificationRepository.save(notification);
    }
    
    // Transformar a DTO
    return this.toDto(notification);
  }
  
  /**
   * Convierte una notificación del dominio a DTO
   */
  private toDto(notification: Notification): NotificationDto {
    const dto = new NotificationDto();
    dto.id = notification.id;
    dto.userId = notification.userId;
    dto.title = notification.title;
    dto.message = notification.message;
    dto.type = notification.type;
    dto.read = notification.read;
    dto.relatedEntityId = notification.relatedEntityId;
    dto.relatedEntityType = notification.relatedEntityType;
    dto.createdAt = notification.createdAt;
    dto.updatedAt = notification.updatedAt;
    return dto;
  }
} 