import { Query } from '../../core/interfaces/Query';
import { NotFoundException, ValidationException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { NotificationPreferenceRepository } from '../repositories/NotificationPreferenceRepository';
import { NotificationChannel, NotificationPreference, NotificationType } from '../commands/UpdateNotificationPreferenceCommand';

/**
 * Query para obtener preferencias de notificación de un usuario
 */
export class GetNotificationPreferenceQuery implements Query<NotificationPreference[]> {
  constructor(
    private readonly userId: string,
    private readonly userRepository: UserRepository,
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
    private readonly type?: NotificationType
  ) {}

  /**
   * Ejecuta la consulta para obtener preferencias de notificación
   * @returns Promise<NotificationPreference[]> Lista de preferencias de notificación
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el usuario no existe
   */
  async execute(): Promise<NotificationPreference[]> {
    // Validación básica
    if (!this.userId) {
      throw new ValidationException('ID de usuario es requerido');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    let preferences: NotificationPreference[] = [];

    // Si se especificó un tipo, obtenemos solo esa preferencia
    if (this.type) {
      const preference = await this.notificationPreferenceRepository.findByUserAndType(
        this.userId,
        this.type
      );
      
      if (preference) {
        preferences = [preference];
      } else {
        // Si no existe, devolvemos una preferencia por defecto
        preferences = [this.createDefaultPreference(this.userId, this.type)];
      }
    } else {
      // Si no se especificó tipo, obtenemos todas las preferencias
      preferences = await this.notificationPreferenceRepository.findByUserId(this.userId);
      
      // Asegurarnos de que existan preferencias para todos los tipos
      if (preferences.length < Object.values(NotificationType).length) {
        const existingTypes = preferences.map(p => p.type);
        const missingTypes = Object.values(NotificationType).filter(
          type => !existingTypes.includes(type)
        );
        
        // Crear preferencias por defecto para los tipos faltantes
        const defaultPreferences = missingTypes.map(type => 
          this.createDefaultPreference(this.userId, type)
        );
        
        // Combinar las preferencias existentes con las por defecto
        preferences = [...preferences, ...defaultPreferences];
      }
    }

    return preferences;
  }

  /**
   * Crea una preferencia de notificación con valores por defecto
   */
  private createDefaultPreference(userId: string, type: NotificationType): NotificationPreference {
    return {
      userId,
      type,
      channels: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.IN_APP]: true
      },
      enabled: true,
      updatedAt: new Date()
    };
  }
} 