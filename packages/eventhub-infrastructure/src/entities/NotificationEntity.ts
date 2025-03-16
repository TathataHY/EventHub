import { NotificationType } from 'eventhub-domain';

/**
 * Entidad ORM para notificaciones
 * Representa la estructura de la tabla de notificaciones en la base de datos
 */
export class NotificationEntity {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.type = params.type;
    this.title = params.title;
    this.message = params.message;
    this.data = params.data;
    this.isRead = params.isRead;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
} 