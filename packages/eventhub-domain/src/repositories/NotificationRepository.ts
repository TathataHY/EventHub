import { Notification } from '../entities/Notification';

/**
 * Opciones para filtrar notificaciones
 */
export interface FindNotificationsOptions {
  page?: number;
  limit?: number;
  read?: boolean;
}

/**
 * Interfaz del repositorio de notificaciones
 * Define las operaciones que se pueden realizar con las notificaciones sin importar la tecnología subyacente
 */
export interface NotificationRepository {
  /**
   * Encuentra una notificación por ID
   * @param id ID de la notificación
   */
  findById(id: string): Promise<Notification | null>;

  /**
   * Encuentra todas las notificaciones
   */
  findAll(): Promise<Notification[]>;

  /**
   * Encuentra notificaciones de un usuario específico
   * @param userId ID del usuario
   */
  findByUserId(userId: string): Promise<Notification[]>;

  /**
   * Encuentra notificaciones de un usuario con un estado de lectura específico
   * @param userId ID del usuario
   * @param read Estado de lectura (true para leídas, false para no leídas)
   */
  findByUserIdAndReadStatus(userId: string, read: boolean): Promise<Notification[]>;

  /**
   * Encuentra notificaciones de un usuario con opciones de filtrado y paginación
   * @param userId ID del usuario
   * @param options Opciones de filtrado y paginación
   * @returns Lista de notificaciones y el total
   */
  findByUserId(userId: string, options: FindNotificationsOptions): Promise<{ notifications: Notification[], total: number }>;

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
   * Guarda una notificación
   * @param notification Notificación a guardar
   * @returns La notificación guardada
   */
  save(notification: Notification): Promise<Notification>;

  /**
   * Elimina una notificación
   * @param id ID de la notificación
   */
  delete(id: string): Promise<void>;
} 