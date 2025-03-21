// Re-exporting domain entities and interfaces
import { 
  NotificationRepository,
  FindNotificationsOptions
} from '../../eventhub-domain/src/notifications/repositories/NotificationRepository';

import {
  NotificationPreferenceRepository
} from '../../eventhub-domain/src/notifications/repositories/NotificationPreferenceRepository';

// DTOs
export * from './dtos/NotificationDTO';
export * from './dtos/NotificationPreferenceDTO';

// Commands
export * from './commands/CreateNotificationCommand';
export * from './commands/MarkNotificationAsReadCommand';
export * from './commands/MarkAllNotificationsAsReadCommand';
export * from './commands/DeleteNotificationCommand';
export * from './commands/SendNotificationCommand';
export * from './commands/UpdateNotificationPreferenceCommand';

// Queries
export * from './queries/GetNotificationByIdQuery';
export * from './queries/GetUserNotificationsQuery';
export * from './queries/GetUnreadNotificationsCountQuery';
export * from './queries/GetNotificationPreferenceQuery';

// Mappers
export * from './mappers/NotificationMapper';
export * from './mappers/NotificationPreferenceMapper';

// Services
export * from './services/NotificationService';

// Re-export from domain
export { 
  NotificationRepository,
  FindNotificationsOptions,
  NotificationPreferenceRepository
}; 