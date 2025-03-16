// Exportaciones del dominio
// Aquí se exportarán las entidades, value objects, interfaces de repositorios, etc.

// Entidades
export { Event } from './entities/Event';
export { User } from './entities/User';
export { Notification } from './entities/Notification';
export { NotificationPreference } from './entities/NotificationPreference';

// Value Objects
export { Role } from './value-objects/Role';
export { NotificationType } from './value-objects/NotificationType';

// Excepciones de entidades
export { EventCreateException } from './exceptions/EventCreateException';
export { EventUpdateException } from './exceptions/EventUpdateException';
export { EventAttendanceException } from './exceptions/EventAttendanceException';
export { UserCreateException } from './exceptions/UserCreateException';
export { UserUpdateException } from './exceptions/UserUpdateException';
export { NotificationCreateException } from './exceptions/NotificationCreateException';

// Interfaces de repositorios
export { EventRepository, EventFilters } from './repositories/EventRepository';
export { UserRepository } from './repositories/UserRepository';
export { NotificationRepository, FindNotificationsOptions } from './repositories/NotificationRepository';
export { NotificationPreferenceRepository } from './repositories/NotificationPreferenceRepository';

export {}; // Exportación vacía por ahora 