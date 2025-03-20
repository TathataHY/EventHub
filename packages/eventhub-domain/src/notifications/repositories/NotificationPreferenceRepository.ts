import { Repository } from '../../core/interfaces/Repository';
import { NotificationPreference } from '../entities/NotificationPreference';

/**
 * Interfaz del repositorio de preferencias de notificaciones
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para preferencias de notificaciones
 */
export interface NotificationPreferenceRepository extends Repository<NotificationPreference, string> {
  /**
   * Encuentra las preferencias de notificación por ID de usuario
   * @param userId ID del usuario
   * @returns Preferencias de notificación o null si no existen
   */
  findByUserId(userId: string): Promise<NotificationPreference | null>;

  /**
   * Crea preferencias de notificación por defecto para un usuario
   * @param userId ID del usuario
   * @returns Preferencias de notificación creadas
   */
  createDefaultForUser(userId: string): Promise<NotificationPreference>;
} 