import { Injectable } from '@nestjs/common';
import { NotificationPreferenceRepository, NotificationPreference } from 'eventhub-domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationPreferenceRepositoryImpl implements NotificationPreferenceRepository {
  private preferences: NotificationPreference[] = [];

  async findById(id: string): Promise<NotificationPreference | null> {
    const preference = this.preferences.find(p => p.id === id);
    return preference ? this.clone(preference) : null;
  }

  async findByUserId(userId: string): Promise<NotificationPreference | null> {
    const preference = this.preferences.find(p => p.userId === userId);
    return preference ? this.clone(preference) : null;
  }

  async create(preference: NotificationPreference): Promise<NotificationPreference> {
    // Verificar que no exista una preferencia para este usuario
    const existing = await this.findByUserId(preference.userId);
    if (existing) {
      throw new Error(`Ya existe una preferencia para el usuario ${preference.userId}`);
    }
    
    // Guardar
    const newPreference = this.clone(preference);
    this.preferences.push(newPreference);
    return newPreference;
  }

  async update(preference: NotificationPreference): Promise<NotificationPreference> {
    const index = this.preferences.findIndex(p => p.id === preference.id);
    
    if (index === -1) {
      throw new Error(`Preferencia con ID ${preference.id} no encontrada`);
    }
    
    const updatedPreference = this.clone(preference);
    this.preferences[index] = updatedPreference;
    return updatedPreference;
  }

  async delete(id: string): Promise<void> {
    const index = this.preferences.findIndex(p => p.id === id);
    
    if (index !== -1) {
      this.preferences.splice(index, 1);
    }
  }

  /**
   * Obtiene o crea preferencias para un usuario
   * @param userId ID del usuario
   * @returns Preferencias del usuario
   */
  async getOrCreate(userId: string): Promise<NotificationPreference> {
    let preference = await this.findByUserId(userId);
    
    if (!preference) {
      // Crear preferencias por defecto
      preference = new NotificationPreference(
        uuidv4(),
        userId,
        true, // emailEnabled
        false, // pushEnabled
        true, // inAppEnabled
        true, // eventReminder
        true, // eventUpdated
        true, // eventCancelled
        true, // newAttendee
        true, // attendeeRemoved
        true, // systemNotifications
        new Date(),
        new Date()
      );
      
      await this.create(preference);
    }
    
    return preference;
  }
  
  /**
   * Clona una preferencia para evitar mutaciones no deseadas
   * @param preference Preferencia a clonar
   * @returns Clon de la preferencia
   */
  private clone(preference: NotificationPreference): NotificationPreference {
    return new NotificationPreference(
      preference.id,
      preference.userId,
      preference.emailEnabled,
      preference.pushEnabled,
      preference.inAppEnabled,
      preference.eventReminder,
      preference.eventUpdated,
      preference.eventCancelled,
      preference.newAttendee,
      preference.attendeeRemoved,
      preference.systemNotifications,
      preference.createdAt,
      preference.updatedAt
    );
  }
} 