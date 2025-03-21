import { NotificationTemplate } from '@eventhub/shared/domain/notification-templates/NotificationTemplate';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { ValidationException } from '@eventhub/shared/domain/exceptions/ValidationException';
import { CreateNotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';

export class CreateNotificationTemplateCommand implements Command<CreateNotificationTemplateDTO, NotificationTemplate> {
  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

  /**
   * Ejecuta el comando para crear una plantilla de notificación
   */
  async execute(data: CreateNotificationTemplateDTO): Promise<NotificationTemplate> {
    this.validateTemplateData(data);
    
    const exists = await this.notificationTemplateRepository.existsByName(data.name);
    if (exists) {
      throw new ValidationException('Ya existe una plantilla con este nombre');
    }

    const template = NotificationTemplateMapper.toDomain(data);
    return this.notificationTemplateRepository.save(template);
  }

  /**
   * Valida los datos de la plantilla
   */
  private validateTemplateData(data: CreateNotificationTemplateDTO): void {
    if (!data.name) {
      throw new ValidationException('El nombre es requerido');
    }

    if (data.name.length > 100) {
      throw new ValidationException('El nombre no puede exceder los 100 caracteres');
    }

    if (!data.description) {
      throw new ValidationException('La descripción es requerida');
    }

    if (data.description.length > 500) {
      throw new ValidationException('La descripción no puede exceder los 500 caracteres');
    }

    if (!data.type) {
      throw new ValidationException('El tipo es requerido');
    }

    if (!data.subject) {
      throw new ValidationException('El asunto es requerido');
    }

    if (data.subject.length > 200) {
      throw new ValidationException('El asunto no puede exceder los 200 caracteres');
    }

    if (!data.body) {
      throw new ValidationException('El contenido es requerido');
    }

    if (data.body.length > 5000) {
      throw new ValidationException('El contenido no puede exceder los 5000 caracteres');
    }

    if (!Array.isArray(data.variables)) {
      throw new ValidationException('Las variables deben ser un array');
    }
  }
} 