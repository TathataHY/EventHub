/**
 * Definiciones de tipos para inyección de dependencias con inversify
 */
export const TYPES = {
  // Repositorios
  EventRepository: Symbol.for('EventRepository'),
  UserRepository: Symbol.for('UserRepository'),
  NotificationRepository: Symbol.for('NotificationRepository'),
  NotificationPreferenceRepository: Symbol.for('NotificationPreferenceRepository'),
  NotificationTemplateRepository: Symbol.for('NotificationTemplateRepository'),
  CommentRepository: Symbol.for('CommentRepository'),
  RatingRepository: Symbol.for('RatingRepository'),

  // Servicios
  NotificationService: Symbol.for('NotificationService'),
  
  // Adaptadores de canales de notificación
  NotificationChannelAdapters: Symbol.for('NotificationChannelAdapters')
}; 