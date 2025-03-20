/**
 * Capa de Dominio de EventHub
 * 
 * Este archivo exporta todos los componentes de la capa de dominio organizados por módulos.
 * Cada módulo representa un contexto acotado (bounded context) dentro del dominio de la aplicación,
 * implementando los principios de Domain-Driven Design.
 * 
 * La capa de dominio es independiente de frameworks y tecnologías específicas,
 * contiene las reglas de negocio y define contratos mediante interfaces.
 *
 * @module eventhub-domain
 */

// Core - Componentes base compartidos por todos los módulos
/**
 * Interfaces y excepciones fundamentales del core
 * Estas interfaces son la base para la implementación de todos los módulos de dominio
 */
export * from './core/interfaces/Entity';
export * from './core/interfaces/Repository';
export * from './core/interfaces/ValueObject';
export * from './core/exceptions/DomainException';

// Módulos completos de dominio
/**
 * Módulos de dominio organizados por características del negocio
 * Cada módulo exporta sus propias entidades, objetos de valor, excepciones e interfaces de repositorio
 */
export * from './users';          // Gestión de usuarios y roles
export * from './events';         // Gestión de eventos
export * from './notifications';  // Sistema de notificaciones
export * from './groups';         // Gestión de grupos de usuarios
export * from './payments';       // Pagos y transacciones

// Módulo de asistencias a eventos
/**
 * Módulo para gestionar la asistencia de usuarios a eventos
 */
export { 
  EventAttendee, 
  EventAttendeeProps, 
  EventAttendeeCreateProps, 
  EventAttendeeUpdateProps,
  AttendanceStatus, 
  AttendanceStatusEnum,
  EventAttendeeCreateException,
  EventAttendeeUpdateException,
  EventAttendeeRepository,
  EventAttendeeFilters
} from './attendances';
// Renombramos PaginationOptions de attendances para evitar conflicto con events
export { PaginationOptions as AttendancePaginationOptions } from './attendances';

// Exportaciones del módulo de reviews
export {
  Review,
  ReviewProps,
  ReviewCreateProps,
  ReviewCreateException,
  ReviewUpdateException,
  ReviewRepository,
  ReviewFilters,
  ReviewDistribution
} from './reviews';
// Renombramos PaginationOptions de reviews para evitar conflicto con events y attendances
export { PaginationOptions as ReviewPaginationOptions } from './reviews';

// Exportaciones del módulo de notification-templates
export {
  NotificationTemplate,
  NotificationTemplateProps,
  NotificationTemplateCreateProps,
  NotificationChannel,
  NotificationChannelVO,
  NotificationTemplateCreateException,
  NotificationTemplateUpdateException,
  NotificationTemplateRepository,
  NotificationTemplateFilters
} from './notification-templates';
// Renombramos PaginationOptions de notification-templates para evitar conflicto con otros módulos
export { PaginationOptions as NotificationTemplatePaginationOptions } from './notification-templates';

// Exportaciones del módulo de locations
export {
  Location,
  LocationProps,
  LocationCreateProps,
  LocationUpdateProps,
  Address,
  AddressProps,
  Coordinates,
  CoordinatesProps,
  LocationCreateException,
  LocationUpdateException,
  LocationRepository,
  LocationFilters
} from './locations';
// Renombramos PaginationOptions de locations para evitar conflicto con otros módulos
export { PaginationOptions as LocationPaginationOptions } from './locations';

// Exportaciones del módulo de event-types
export {
  EventType,
  EventTypeProps,
  EventTypeCreateProps,
  EventTypeUpdateProps,
  EventTypeCreateException,
  EventTypeUpdateException,
  EventTypeRepository,
  EventTypeFilters
} from './event-types';
// Renombramos PaginationOptions de event-types para evitar conflicto con otros módulos
export { PaginationOptions as EventTypePaginationOptions } from './event-types';

// Exportaciones del módulo de categories
export {
  Category,
  CategoryProps,
  CategoryCreateProps,
  CategoryUpdateProps,
  CategoryCreateException,
  CategoryUpdateException,
  CategoryRepository,
  CategoryFilters
} from './categories';
// Renombramos PaginationOptions de categories para evitar conflicto con otros módulos
export { PaginationOptions as CategoryPaginationOptions } from './categories';

// Exportaciones del módulo de media
export {
  MediaFile,
  MediaFileProps,
  MediaFileCreateProps,
  MediaFileUpdateProps,
  MediaEntityType,
  FileType,
  FileTypeEnum,
  MediaFileCreateException,
  MediaFileUpdateException,
  MediaFileRepository,
  MediaFileFilters
} from './media';
// Renombramos PaginationOptions de media para evitar conflicto con otros módulos
export { PaginationOptions as MediaPaginationOptions } from './media';

// Tickets
export {
  Ticket,
  TicketProps,
  TicketCreateProps,
  TicketUpdateProps,
  TicketType,
  TicketTypeEnum,
  TicketStatus,
  TicketStatusEnum,
  TicketRepository,
  TicketFilterOptions as TicketPaginationOptions,
  TicketCreateException,
  TicketUpdateException
} from './tickets';

// Exportaciones antiguas para mantener compatibilidad
// TODO: Eliminar estas exportaciones cuando se complete la migración
// Las entidades ya reorganizadas se comentan para evitar conflictos
// export * from './entities/Event'; // Ya exportado desde './events'
// export * from './entities/User'; // Ya exportado desde './users'
// export * from './entities/Notification'; // Ya exportado desde './notifications'
// export * from './entities/NotificationPreference'; // Ya exportado desde './notifications'
// export * from './entities/Comment'; // Ya exportado desde './comments'
// export * from './entities/Rating'; // Ya exportado desde './ratings'
// export * from './entities/Payment'; // Ya exportado desde './payments'
// export * from './entities/Ticket'; // Ya exportado desde './tickets'
// export * from './entities/Group'; // Ya exportado desde './groups'
// export * from './entities/GroupMember'; // Ya exportado desde './groups'
// export * from './entities/EventAttendee'; // Ya exportado desde './attendances'
// export * from './entities/EventReview'; // Ya exportado desde './reviews'

// export * from './value-objects/Role'; // Ya exportado desde './users'
// export * from './value-objects/NotificationType'; // Ya exportado desde './notifications'
// export * from './value-objects/NotificationTemplate'; // Ya exportado desde './notification-templates'
// export * from './value-objects/NotificationChannel'; // Ya exportado desde './notification-templates'

// Las excepciones ya reorganizadas se comentan para evitar conflictos
// export * from './exceptions/EventCreateException'; // Ya exportado desde './events'
// export * from './exceptions/EventUpdateException'; // Ya exportado desde './events'
// export * from './exceptions/EventAttendanceException'; // Ya exportado desde './events'
// export * from './exceptions/UserCreateException'; // Ya exportado desde './users'
// export * from './exceptions/UserUpdateException'; // Ya exportado desde './users'
// export * from './exceptions/NotificationCreateException'; // Ya exportado desde './notifications'
// export * from './exceptions/NotificationPreferenceException'; // Ya exportado desde './notifications'
// export * from './exceptions/CommentCreateException'; // Ya exportado desde './comments'
// export * from './exceptions/CommentUpdateException'; // Ya exportado desde './comments'
// export * from './exceptions/RatingCreateException'; // Ya exportado desde './ratings'
// export * from './exceptions/RatingUpdateException'; // Ya exportado desde './ratings'
// export * from './exceptions/PaymentCreateException'; // Ya exportado desde './payments'
// export * from './exceptions/PaymentUpdateException'; // Ya exportado desde './payments'
// export * from './exceptions/TicketCreateException'; // Ya exportado desde './tickets'
// export * from './exceptions/TicketUpdateException'; // Ya exportado desde './tickets'
// export * from './exceptions/EventAttendeeCreateException'; // Ya exportado desde './attendances'
// export * from './exceptions/EventAttendeeUpdateException'; // Ya exportado desde './attendances'
// export * from './exceptions/ReviewCreateException'; // Ya exportado desde './reviews'
// export * from './exceptions/ReviewUpdateException'; // Ya exportado desde './reviews'
// export * from './exceptions/NotificationTemplateCreateException'; // Ya exportado desde './notification-templates'
// export * from './exceptions/NotificationTemplateUpdateException'; // Ya exportado desde './notification-templates'
// export * from './exceptions/LocationCreateException'; // Ya exportado desde './locations'
// export * from './exceptions/LocationUpdateException'; // Ya exportado desde './locations'

// Los repositorios ya reorganizados se comentan para evitar conflictos
// export * from './repositories/EventRepository'; // Ya exportado desde './events'
// export * from './repositories/UserRepository'; // Ya exportado desde './users'
// export * from './repositories/NotificationRepository'; // Ya exportado desde './notifications'
// export * from './repositories/NotificationPreferenceRepository'; // Ya exportado desde './notifications'
// export * from './repositories/CommentRepository'; // Ya exportado desde './comments'
// export * from './repositories/RatingRepository'; // Ya exportado desde './ratings'
// export * from './repositories/IPaymentRepository'; // Ya exportado desde './payments'
// export * from './repositories/ITicketRepository'; // Ya exportado desde './tickets'
// export * from './repositories/IGroupRepository'; // Ya exportado desde './groups'
// export * from './repositories/IGroupMemberRepository'; // Ya exportado desde './groups'
// export * from './repositories/EventAttendeeRepository'; // Ya exportado desde './attendances'
// export * from './repositories/ReviewRepository'; // Ya exportado desde './reviews'
// export * from './repositories/INotificationTemplateRepository'; // Ya exportado desde './notification-templates'
// export * from './repositories/ILocationRepository'; // Ya exportado desde './locations'

// Se elimina la exportación vacía ya que no es necesaria y puede causar errores
// export {};

// Se eliminan las importaciones a archivos antiguos que ya no existen
// // Entidades
// export * from './user/User';
// // export * from './payment/Payment'; // Ahora exportado desde ./payments
// // export * from './ticket/Ticket'; // Ahora exportado desde ./tickets
// export * from './event-type/EventType';
// export * from './group/Group';
// // export * from './event-attendee/EventAttendee'; // Ahora exportado desde ./attendances
// export * from './event-review/EventReview';
// export * from './notification/Notification';
// export * from './notification-preference/NotificationPreference';

// // Repositorios
// export * from './repositories/IUserRepository';
// // export * from './repositories/IPaymentRepository'; // Ahora exportado desde ./payments
// export * from './repositories/IEventTypeRepository';
// export * from './repositories/IGroupRepository';
// // export * from './repositories/IEventAttendeeRepository'; // Ahora exportado desde ./attendances
// export * from './repositories/IEventReviewRepository';
// export * from './repositories/INotificationRepository';
// export * from './repositories/INotificationPreferenceRepository';

// // Excepciones
// export * from './exceptions/DomainException';
// export * from './exceptions/EntityNotFoundException';
// export * from './exceptions/UserCreateException';
// export * from './exceptions/EventCreateException';
// export * from './exceptions/LocationCreateException';
// // export * from './exceptions/PaymentCreateException'; // Ahora exportado desde ./payments
// export * from './exceptions/EventTypeCreateException';
// export * from './exceptions/GroupCreateException';
// // export * from './exceptions/EventAttendeeCreateException'; // Ahora exportado desde ./attendances
// export * from './exceptions/EventReviewCreateException';
// export * from './exceptions/NotificationCreateException';
// export * from './exceptions/NotificationPreferenceCreateException'; 