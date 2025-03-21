import { NotificationTemplate } from '@eventhub/shared/domain/notification-templates/NotificationTemplate';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';
import { ValidationException } from '@eventhub/shared/domain/exceptions/ValidationException';
import { UpdateNotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';

interface UpdateNotificationTemplateParams {
  id: string;
  data: UpdateNotificationTemplateDTO;
}

export class UpdateNotificationTemplateCommand implements Command<UpdateNotificationTemplateParams, NotificationTemplate> {
  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

  /**
   * Ejecuta el comando para actualizar una plantilla de notificación
   */
  async execute(params: UpdateNotificationTemplateParams): Promise<NotificationTemplate> {
    const { id, data } = params;

    // Validar los datos
    this.validateUpdateData(data);

    // Obtener la plantilla existente
    const template = await this.notificationTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundException(`Plantilla de notificación con ID ${id} no encontrada`);
    }

    // Si se intenta cambiar el nombre, verificar que no exista otro con ese nombre
    if (data.name && data.name !== template.name) {
      const exists = await this.notificationTemplateRepository.existsByName(data.name);
      if (exists) {
        throw new ValidationException('Ya existe otra plantilla con este nombre');
      }
    }

    // Actualizar campos
    if (data.name !== undefined) {
      template.name = data.name;
    }

    if (data.description !== undefined) {
      template.description = data.description;
    }

    if (data.type !== undefined) {
      template.type = data.type;
    }

    if (data.subject !== undefined) {
      template.subject = data.subject;
    }

    if (data.body !== undefined) {
      template.body = data.body;
    }

    if (data.variables !== undefined) {
      template.variables = data.variables;
    }

    if (data.isActive !== undefined) {
      template.isActive = data.isActive;
    }

    template.updatedAt = new Date();

    // Guardar los cambios
    return this.notificationTemplateRepository.save(template);
  }

  /**
   * Valida los datos de actualización
   */
  private validateUpdateData(data: UpdateNotificationTemplateDTO): void {
    if (data.name && data.name.length > 100) {
      throw new ValidationException('El nombre no puede exceder los 100 caracteres');
    }

    if (data.description && data.description.length > 500) {
      throw new ValidationException('La descripción no puede exceder los 500 caracteres');
    }

    if (data.subject && data.subject.length > 200) {
      throw new ValidationException('El asunto no puede exceder los 200 caracteres');
    }

    if (data.body && data.body.length > 5000) {
      throw new ValidationException('El contenido no puede exceder los 5000 caracteres');
    }

    if (data.variables && !Array.isArray(data.variables)) {
      throw new ValidationException('Las variables deben ser un array');
    }
  }
} 