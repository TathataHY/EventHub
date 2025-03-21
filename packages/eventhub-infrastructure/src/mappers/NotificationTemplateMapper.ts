import { NotificationTemplate } from '../../../eventhub-domain/src/value-objects/NotificationTemplate';
import { NotificationTemplateEntity } from '../entities/NotificationTemplateEntity';

/**
 * Mapper para transformar entre objetos de valor de dominio y entidades de TypeORM para plantillas de notificación
 */
export class NotificationTemplateMapper {
  /**
   * Convierte un objeto de valor de dominio a una entidad de TypeORM
   * @param template Objeto de valor de dominio
   * @returns Entidad de TypeORM
   */
  static toEntity(template: NotificationTemplate): NotificationTemplateEntity {
    const entity = new NotificationTemplateEntity();
    
    entity.id = template.id;
    entity.name = template.name;
    entity.description = template.description;
    entity.notificationType = template.notificationType;
    entity.channel = template.channel;
    entity.titleTemplate = template.titleTemplate;
    entity.bodyTemplate = template.bodyTemplate;
    entity.htmlTemplate = template.htmlTemplate;
    entity.active = template.active;
    entity.createdAt = template.createdAt;
    entity.updatedAt = template.updatedAt;
    
    return entity;
  }

  /**
   * Convierte una entidad de TypeORM a un objeto de valor de dominio
   * @param entity Entidad de TypeORM
   * @returns Objeto de valor de dominio
   */
  static toDomain(entity: NotificationTemplateEntity): NotificationTemplate {
    return new NotificationTemplate({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      notificationType: entity.notificationType,
      channel: entity.channel,
      titleTemplate: entity.titleTemplate,
      bodyTemplate: entity.bodyTemplate,
      htmlTemplate: entity.htmlTemplate,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 