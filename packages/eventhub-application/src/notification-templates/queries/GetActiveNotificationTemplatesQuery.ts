import { NotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

export class GetActiveNotificationTemplatesQuery implements Query<void, NotificationTemplateDTO[]> {
  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

  /**
   * Ejecuta la consulta para obtener plantillas activas
   */
  async execute(): Promise<NotificationTemplateDTO[]> {
    const templates = await this.notificationTemplateRepository.findActive();
    return NotificationTemplateMapper.toDTOList(templates);
  }
} 