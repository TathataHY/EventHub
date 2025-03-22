import { NotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';
import { NotificationType } from '../dtos/NotificationTemplateDTO';
import { ValidationException } from '@eventhub/shared/domain/exceptions/ValidationException';

export class GetNotificationTemplatesByTypeQuery implements Query<NotificationType, NotificationTemplateDTO[]> {
  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

  /**
   * Ejecuta la consulta para obtener plantillas por tipo
   */
  async execute(type: NotificationType): Promise<NotificationTemplateDTO[]> {
    if (!type) {
      throw new ValidationException('El tipo de plantilla es requerido');
    }

    const templates = await this.notificationTemplateRepository.findByType(type);
    return NotificationTemplateMapper.toDTOList(templates);
  }
} 