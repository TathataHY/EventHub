// Entidades/Value Objects
export { NotificationTemplate } from './value-objects/NotificationTemplate';
export { type NotificationTemplateProps, type NotificationTemplateCreateProps } from './value-objects/NotificationTemplate';
export { NotificationChannel, NotificationChannelVO } from './value-objects/NotificationChannel';

// Repositorios
export { 
  type NotificationTemplateRepository, 
  type NotificationTemplateFilters,
  type PaginationOptions
} from './repositories/NotificationTemplateRepository';

// Excepciones
export { NotificationTemplateCreateException } from './exceptions/NotificationTemplateCreateException';
export { NotificationTemplateUpdateException } from './exceptions/NotificationTemplateUpdateException'; 