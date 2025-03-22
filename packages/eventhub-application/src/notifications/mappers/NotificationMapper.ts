import { Mapper } from '../../core/interfaces/Mapper';
import { Notification } from '@eventhub/domain/dist/notifications/entities/Notification';
import { NotificationDTO } from '../dtos/NotificationDTO';
import { NotificationAdapter } from '../adapters/NotificationAdapter';

/**
 * Mapper para convertir entre notificaciones de dominio y DTOs
 */
export class NotificationMapper implements Mapper<Notification, NotificationDTO> {
  /**
   * Convierte una notificación del dominio a un DTO
   */
  toDTO(notification: Notification | null): NotificationDTO | null {
    if (!notification) return null;
    
    return NotificationAdapter.toApplication(notification);
  }

  /**
   * Convierte un DTO de notificación a una entidad de dominio
   */
  toDomain(dto: NotificationDTO): any {
    if (!dto) return null;
    
    return NotificationAdapter.toDomain(dto);
  }
} 