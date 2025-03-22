import { NotificationTemplateSearchResultDTO, NotificationType } from '../dtos/NotificationTemplateDTO';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';
import { ValidationException } from '@eventhub/shared/domain/exceptions/ValidationException';

interface SearchNotificationTemplatesParams {
  page: number;
  limit: number;
  type?: NotificationType;
  search?: string;
}

export class SearchNotificationTemplatesQuery implements Query<SearchNotificationTemplatesParams, NotificationTemplateSearchResultDTO> {
  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

  /**
   * Ejecuta la consulta para buscar plantillas con paginación
   */
  async execute(params: SearchNotificationTemplatesParams): Promise<NotificationTemplateSearchResultDTO> {
    const { page, limit, type, search } = params;

    this.validateParams(params);

    const result = await this.notificationTemplateRepository.findWithPagination(page, limit, type, search);

    return {
      templates: NotificationTemplateMapper.toDTOList(result.templates),
      total: result.total,
      page,
      limit
    };
  }

  /**
   * Valida los parámetros de búsqueda
   */
  private validateParams(params: SearchNotificationTemplatesParams): void {
    if (params.page <= 0) {
      throw new ValidationException('La página debe ser mayor a 0');
    }

    if (params.limit <= 0) {
      throw new ValidationException('El límite debe ser mayor a 0');
    }

    if (params.limit > 100) {
      throw new ValidationException('El límite no puede ser mayor a 100');
    }
  }
} 