import { NotificationTemplate } from '@eventhub/shared/domain/notification-templates/NotificationTemplate';
import { NotificationTemplateDTO, CreateNotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';

export class NotificationTemplateMapper {
  /**
   * Convierte una entidad de dominio a DTO
   */
  static toDTO(domain: NotificationTemplate): NotificationTemplateDTO {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      type: domain.type,
      subject: domain.subject,
      body: domain.body,
      variables: domain.variables,
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades de dominio a DTOs
   */
  static toDTOList(domains: NotificationTemplate[]): NotificationTemplateDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO de creación a entidad de dominio
   */
  static toDomain(dto: CreateNotificationTemplateDTO): NotificationTemplate {
    return new NotificationTemplate({
      name: dto.name,
      description: dto.description,
      type: dto.type,
      subject: dto.subject,
      body: dto.body,
      variables: dto.variables,
      isActive: true
    });
  }
} 