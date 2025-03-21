/**
 * DTO para representar una plantilla de notificación
 */
export interface NotificationTemplateDTO {
  id: string;
  name: string;
  description: string;
  type: NotificationType;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tipos de notificaciones disponibles
 */
export enum NotificationType {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
  IN_APP = 'IN_APP'
}

/**
 * DTO para crear una plantilla de notificación
 */
export interface CreateNotificationTemplateDTO {
  name: string;
  description: string;
  type: NotificationType;
  subject: string;
  body: string;
  variables: string[];
}

/**
 * DTO para actualizar una plantilla de notificación
 */
export interface UpdateNotificationTemplateDTO {
  name?: string;
  description?: string;
  type?: NotificationType;
  subject?: string;
  body?: string;
  variables?: string[];
  isActive?: boolean;
}

/**
 * DTO para la respuesta de búsqueda de plantillas
 */
export interface NotificationTemplateSearchResultDTO {
  templates: NotificationTemplateDTO[];
  total: number;
  page: number;
  limit: number;
} 