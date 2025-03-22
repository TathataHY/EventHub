import { Repository } from '../../core/interfaces/Repository';
import { Notification } from '../entities/Notification';

/**
 * Opciones para filtrar notificaciones
 */
export interface FindNotificationsOptions {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

/**
 * Interfaz del repositorio de notificaciones
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para notificaciones
 */
export interface NotificationRepository extends Repository<Notification, string> {
  /**
   * Encuentra notificaciones de un usuario específico
   * @param userId ID del usuario
   * @returns Lista de notificaciones
   */
  findByUserId(userId: string): Promise<Notification[]>;

  /**
   * Encuentra notificaciones de un usuario con un estado de lectura específico
   * @param userId ID del usuario
   * @param read Estado de lectura (true para leídas, false para no leídas)
   * @returns Lista de notificaciones
   */
  findByUserIdAndReadStatus(userId: string, read: boolean): Promise<Notification[]>;

  /**
   * Encuentra notificaciones de un usuario con opciones de filtrado y paginación
   * @param userId ID del usuario
   * @param options Opciones de filtrado y paginación
   * @returns Lista de notificaciones y el total
   */
  findByUserIdWithOptions(userId: string, options: FindNotificationsOptions): Promise<{ notifications: Notification[], total: number }>;

  /**
   * Cuenta el número de notificaciones no leídas de un usuario
   * @param userId ID del usuario
   * @returns Número de notificaciones no leídas
   */
  countUnread(userId: string): Promise<number>;

  /**
   * Marca una notificación como leída
   * @param id ID de la notificación
   * @returns La notificación actualizada o null si no existe
   */
  markAsRead(id: string): Promise<Notification | null>;

  /**
   * Marca todas las notificaciones de un usuario como leídas
   * @param userId ID del usuario
   */
  markAllAsRead(userId: string): Promise<void>;
  
  /**
   * Busca notificaciones por ID de usuario y tipo
   * @param userId ID del usuario
   * @param type Tipo de notificación
   * @returns Lista de notificaciones
   */
  findByUserIdAndType(userId: string, type: string): Promise<Notification[]>;

  /**
   * Busca notificaciones no leídas por ID de usuario
   * @param userId ID del usuario
   * @returns Lista de notificaciones no leídas
   */
  findUnreadByUserId(userId: string): Promise<Notification[]>;

  /**
   * Obtiene el conteo de notificaciones no leídas para un usuario
   * @param userId ID del usuario
   * @returns Número de notificaciones no leídas
   */
  countUnreadByUserId(userId: string): Promise<number>;

  /**
   * Marca todas las notificaciones de un usuario como leídas
   * @param userId ID del usuario
   */
  markAllAsReadByUserId(userId: string): Promise<void>;

  /**
   * Marca una notificación como leída o no leída
   * @param id ID de la notificación
   * @param read Estado de lectura (true para leída, false para no leída)
   */
  markAsRead(id: string, read: boolean): Promise<void>;

  /**
   * Elimina todas las notificaciones leídas de un usuario
   * @param userId ID del usuario
   */
  deleteReadByUserId(userId: string): Promise<void>;

  /**
   * Elimina todas las notificaciones de un usuario
   * @param userId ID del usuario
   */
  deleteAllByUserId(userId: string): Promise<void>;
} 