// Re-exportamos las interfaces de dominio
export { 
  NotificationTemplateRepository,
  NotificationTemplateFilters,
  PaginationOptions
} from '@eventhub/domain/src/notification-templates/repositories/NotificationTemplateRepository';

// DTOs
export * from './dtos/NotificationTemplateDTO';
export * from './dtos/CreateNotificationTemplateDTO';
export * from './dtos/UpdateNotificationTemplateDTO';

// Commands
export * from './commands/CreateNotificationTemplateCommand';
export * from './commands/UpdateNotificationTemplateCommand';
export * from './commands/DeleteNotificationTemplateCommand';
export * from './commands/ActivateNotificationTemplateCommand';
export * from './commands/DeactivateNotificationTemplateCommand';

// Queries
export * from './queries/GetNotificationTemplateByIdQuery';
export * from './queries/GetNotificationTemplatesQuery';
export * from './queries/SearchNotificationTemplatesQuery';

// Mappers
export * from './mappers/NotificationTemplateMapper';

// Services
export * from './services/NotificationTemplateService'; 