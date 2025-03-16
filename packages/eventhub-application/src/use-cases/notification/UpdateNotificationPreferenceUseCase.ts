import { Injectable } from '@nestjs/common';
import { NotificationPreference, NotificationPreferenceRepository } from 'eventhub-domain';
import { NotificationPreferenceDto } from '../../dtos/notification/NotificationPreferenceDto';
import { UpdateNotificationPreferenceDto } from '../../dtos/notification/UpdateNotificationPreferenceDto';

/**
 * Caso de uso para actualizar las preferencias de notificaciones de un usuario
 */
@Injectable()
export class UpdateNotificationPreferenceUseCase {
  constructor(
    private readonly preferenceRepository: NotificationPreferenceRepository
  ) {}

  /**
   * Actualiza las preferencias de notificación de un usuario
   * @param userId ID del usuario
   * @param updates Actualizaciones a realizar
   * @returns Preferencias actualizadas
   */
  async execute(userId: string, updates: UpdateNotificationPreferenceDto): Promise<NotificationPreferenceDto> {
    // Obtener preferencias existentes o crear por defecto
    let preference = await this.preferenceRepository.findByUserId(userId);
    
    if (!preference) {
      // Crear preferencias por defecto para el usuario
      preference = new NotificationPreference(
        // Generar un ID aleatorio (normalmente se haría con una función como uuid())
        Math.random().toString(36).substring(2, 15),
        userId
      );
      
      await this.preferenceRepository.create(preference);
    }
    
    // Actualizar canales si se proporcionan
    if (updates.emailEnabled !== undefined || 
        updates.pushEnabled !== undefined || 
        updates.inAppEnabled !== undefined) {
      preference.updateChannels({
        emailEnabled: updates.emailEnabled,
        pushEnabled: updates.pushEnabled,
        inAppEnabled: updates.inAppEnabled
      });
    }
    
    // Actualizar tipos de notificaciones si se proporcionan
    if (updates.eventReminder !== undefined || 
        updates.eventUpdated !== undefined || 
        updates.eventCancelled !== undefined || 
        updates.newAttendee !== undefined || 
        updates.attendeeRemoved !== undefined || 
        updates.systemNotifications !== undefined) {
      preference.updateTypePreferences({
        eventReminder: updates.eventReminder,
        eventUpdated: updates.eventUpdated,
        eventCancelled: updates.eventCancelled,
        newAttendee: updates.newAttendee,
        attendeeRemoved: updates.attendeeRemoved,
        systemNotifications: updates.systemNotifications
      });
    }
    
    // Guardar cambios
    const updatedPreference = await this.preferenceRepository.update(preference);
    
    // Convertir a DTO
    return this.toDto(updatedPreference);
  }
  
  /**
   * Convierte preferencias de notificación de dominio a DTO
   * @param preference Preferencias de dominio
   * @returns DTO
   */
  private toDto(preference: NotificationPreference): NotificationPreferenceDto {
    const dto = new NotificationPreferenceDto();
    dto.id = preference.id;
    dto.userId = preference.userId;
    
    // Canales
    dto.emailEnabled = preference.emailEnabled;
    dto.pushEnabled = preference.pushEnabled;
    dto.inAppEnabled = preference.inAppEnabled;
    
    // Tipos
    dto.eventReminder = preference.eventReminder;
    dto.eventUpdated = preference.eventUpdated;
    dto.eventCancelled = preference.eventCancelled;
    dto.newAttendee = preference.newAttendee;
    dto.attendeeRemoved = preference.attendeeRemoved;
    dto.systemNotifications = preference.systemNotifications;
    
    dto.createdAt = preference.createdAt;
    dto.updatedAt = preference.updatedAt;
    
    return dto;
  }
} 