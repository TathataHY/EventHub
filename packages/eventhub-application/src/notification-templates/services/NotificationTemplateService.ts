import { NotificationTemplate } from '@eventhub/shared/domain/notification-templates/NotificationTemplate';
import { CreateNotificationTemplateDTO, NotificationTemplateDTO, NotificationTemplateSearchResultDTO, NotificationType, UpdateNotificationTemplateDTO } from '../dtos/NotificationTemplateDTO';
import { CreateNotificationTemplateCommand } from '../commands/CreateNotificationTemplateCommand';
import { UpdateNotificationTemplateCommand } from '../commands/UpdateNotificationTemplateCommand';
import { GetNotificationTemplateQuery } from '../queries/GetNotificationTemplateQuery';
import { GetNotificationTemplatesByTypeQuery } from '../queries/GetNotificationTemplatesByTypeQuery';
import { GetActiveNotificationTemplatesQuery } from '../queries/GetActiveNotificationTemplatesQuery';
import { SearchNotificationTemplatesQuery } from '../queries/SearchNotificationTemplatesQuery';
import { NotificationTemplateRepository } from '../repositories/NotificationTemplateRepository';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';

export class NotificationTemplateService {
  private readonly createNotificationTemplateCommand: CreateNotificationTemplateCommand;
  private readonly updateNotificationTemplateCommand: UpdateNotificationTemplateCommand;
  private readonly getNotificationTemplateQuery: GetNotificationTemplateQuery;
  private readonly getNotificationTemplatesByTypeQuery: GetNotificationTemplatesByTypeQuery;
  private readonly getActiveNotificationTemplatesQuery: GetActiveNotificationTemplatesQuery;
  private readonly searchNotificationTemplatesQuery: SearchNotificationTemplatesQuery;

  constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {
    this.createNotificationTemplateCommand = new CreateNotificationTemplateCommand(notificationTemplateRepository);
    this.updateNotificationTemplateCommand = new UpdateNotificationTemplateCommand(notificationTemplateRepository);
    this.getNotificationTemplateQuery = new GetNotificationTemplateQuery(notificationTemplateRepository);
    this.getNotificationTemplatesByTypeQuery = new GetNotificationTemplatesByTypeQuery(notificationTemplateRepository);
    this.getActiveNotificationTemplatesQuery = new GetActiveNotificationTemplatesQuery(notificationTemplateRepository);
    this.searchNotificationTemplatesQuery = new SearchNotificationTemplatesQuery(notificationTemplateRepository);
  }

  /**
   * Crea una nueva plantilla de notificación
   */
  async createTemplate(data: CreateNotificationTemplateDTO): Promise<NotificationTemplateDTO> {
    const template = await this.createNotificationTemplateCommand.execute(data);
    return NotificationTemplateMapper.toDTO(template);
  }

  /**
   * Actualiza una plantilla de notificación existente
   */
  async updateTemplate(id: string, data: UpdateNotificationTemplateDTO): Promise<NotificationTemplateDTO> {
    const template = await this.updateNotificationTemplateCommand.execute({ id, data });
    return NotificationTemplateMapper.toDTO(template);
  }

  /**
   * Obtiene una plantilla por su ID
   */
  async getTemplate(id: string): Promise<NotificationTemplateDTO> {
    return this.getNotificationTemplateQuery.execute(id);
  }

  /**
   * Obtiene plantillas por tipo
   */
  async getTemplatesByType(type: NotificationType): Promise<NotificationTemplateDTO[]> {
    return this.getNotificationTemplatesByTypeQuery.execute(type);
  }

  /**
   * Obtiene todas las plantillas activas
   */
  async getActiveTemplates(): Promise<NotificationTemplateDTO[]> {
    return this.getActiveNotificationTemplatesQuery.execute();
  }

  /**
   * Busca plantillas con paginación
   */
  async searchTemplates(
    page: number,
    limit: number,
    type?: NotificationType,
    search?: string
  ): Promise<NotificationTemplateSearchResultDTO> {
    return this.searchNotificationTemplatesQuery.execute({ page, limit, type, search });
  }

  /**
   * Obtiene las variables utilizadas en una plantilla
   */
  async getTemplateVariables(templateId: string): Promise<string[]> {
    return this.notificationTemplateRepository.getTemplateVariables(templateId);
  }
} 