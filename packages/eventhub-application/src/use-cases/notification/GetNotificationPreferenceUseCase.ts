import { Injectable } from '@nestjs/common';
import { NotificationPreference, NotificationPreferenceRepository } from 'eventhub-domain';
import { NotificationPreferenceDto } from '../../dtos/notification/NotificationPreferenceDto';

@Injectable()
export class GetNotificationPreferenceUseCase {
  constructor(
    private readonly preferenceRepository: NotificationPreferenceRepository
  ) {}

  /**
   * Obtiene las preferencias de notificación de un usuario
   * @param userId ID del usuario
   * @returns Preferencias de notificación del usuario
   */
  async execute(userId: string): Promise<NotificationPreferenceDto> {
    // Obtener preferencias existentes o crear por defecto
    let preference = await this.preferenceRepository.findByUserId(userId);
    
    if (!preference) {
      // Crear preferencias por defecto para el usuario
      preference = new NotificationPreference(
        // Generar un ID aleatorio
        Math.random().toString(36).substring(2, 15),
        userId
      );
      
      await this.preferenceRepository.create(preference);
    }
    
    // Convertir a DTO
    return this.toDto(preference);
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