import { NotificationPreference } from '../entities/NotificationPreference';

/**
 * Interfaz del repositorio de preferencias de notificaciones
 * Define las operaciones que se pueden realizar con las preferencias de notificaciones sin importar la tecnología subyacente
 */
export interface NotificationPreferenceRepository {
  /**
   * Encuentra las preferencias de notificación por ID
   * @param id ID de las preferencias
   */
  findById(id: string): Promise<NotificationPreference | null>;

  /**
   * Encuentra las preferencias de notificación por ID de usuario
   * @param userId ID del usuario
   */
  findByUserId(userId: string): Promise<NotificationPreference | null>;

  /**
   * Crea nuevas preferencias de notificación
   * @param preference Preferencias a crear
   */
  create(preference: NotificationPreference): Promise<NotificationPreference>;

  /**
   * Actualiza las preferencias de notificación existentes
   * @param preference Preferencias actualizadas
   */
  update(preference: NotificationPreference): Promise<NotificationPreference>;

  /**
   * Elimina las preferencias de notificación
   * @param id ID de las preferencias a eliminar
   */
  delete(id: string): Promise<void>;
} 