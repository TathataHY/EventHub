import { NotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';
import { ValidationException } from '@eventhub/shared/domain/exceptions/ValidationException';

export class GetNotificationTemplateQuery implements Query<string, NotificationTemplateDTO> {
  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

  /**
   * Ejecuta la consulta para obtener una plantilla por ID
   */
  async execute(id: string): Promise<NotificationTemplateDTO> {
    if (!id) {
      throw new ValidationException('El ID de la plantilla es requerido');
    }

    const template = await this.notificationTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundException(`Plantilla de notificación con ID ${id} no encontrada`);
    }

    return NotificationTemplateMapper.toDTO(template);
  }
} 