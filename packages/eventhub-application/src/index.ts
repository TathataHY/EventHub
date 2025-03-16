// Exportaciones de la capa de aplicación
// Aquí se exportarán los casos de uso, servicios de aplicación, etc.

// DTOs
export { CreateEventDto } from './dtos/event/CreateEventDto';
export { UpdateEventDto } from './dtos/event/UpdateEventDto';
export { EventDto } from './dtos/event/EventDto';
export { EventFilters } from './dtos/event/EventFilters';
export { CreateUserDto } from './dtos/user/CreateUserDto';
export { UpdateUserDto } from './dtos/user/UpdateUserDto';
export { UserDto } from './dtos/user/UserDto';
export { 
  CreateNotificationDto, 
  NotificationDto, 
  UpdateNotificationPreferenceDto,
  NotificationPreferenceDto 
} from './dto';

// Casos de uso
export { CreateEventUseCase } from './use-cases/event/CreateEventUseCase';
export { UpdateEventUseCase } from './use-cases/event/UpdateEventUseCase';
export { GetEventByIdUseCase } from './use-cases/event/GetEventByIdUseCase';
export { GetEventsUseCase } from './use-cases/event/GetEventsUseCase';
export { AddAttendeeUseCase } from './use-cases/event/AddAttendeeUseCase';
export { RemoveAttendeeUseCase } from './use-cases/event/RemoveAttendeeUseCase';
export { CancelEventUseCase } from './use-cases/event/CancelEventUseCase';
export { CreateUserUseCase } from './use-cases/user/CreateUserUseCase';
export { GetUserByIdUseCase } from './use-cases/user/GetUserByIdUseCase';
export { UpdateUserUseCase } from './use-cases/user/UpdateUserUseCase';
export { 
  CreateNotificationUseCase, 
  GetUserNotificationsUseCase,
  UpdateNotificationPreferenceUseCase 
} from './use-cases';

// Exportaciones de casos de uso de notificaciones
export { MarkNotificationReadUseCase } from './use-cases/notification/MarkNotificationReadUseCase';
export { MarkAllNotificationsReadUseCase } from './use-cases/notification/MarkAllNotificationsReadUseCase';
export { GetUnreadCountUseCase } from './use-cases/notification/GetUnreadCountUseCase';

export { LoginUseCase } from './use-cases/auth/LoginUseCase';

export { LoginDto } from './dtos/auth/LoginDto';

export {}; // Exportación vacía por ahora 