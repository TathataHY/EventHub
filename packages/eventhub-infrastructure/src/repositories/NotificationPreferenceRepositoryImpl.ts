import { NotificationPreference, NotificationPreferenceRepository } from 'eventhub-domain';
import { NotificationPreferenceEntity } from '../entities/NotificationPreferenceEntity';

/**
 * Implementación concreta del repositorio de preferencias de notificaciones
 */
export class NotificationPreferenceRepositoryImpl implements NotificationPreferenceRepository {
  // En un caso real, aquí inyectaríamos un ORM o cliente de base de datos
  private preferences: NotificationPreferenceEntity[] = [];

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(preference: NotificationPreference): NotificationPreferenceEntity {
    return new NotificationPreferenceEntity({
      id: preference.id,
      userId: preference.userId,
      inApp: preference.inApp,
      email: preference.email,
      push: preference.push,
      eventReminder: preference.eventReminder,
      eventUpdated: preference.eventUpdated,
      eventCancelled: preference.eventCancelled,
      newAttendee: preference.newAttendee,
      attendeeCancelled: preference.attendeeCancelled,
      systemNotification: preference.systemNotification,
      createdAt: preference.createdAt,
      updatedAt: preference.updatedAt,
    });
  }

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private toDomain(entity: NotificationPreferenceEntity): NotificationPreference {
    return new NotificationPreference({
      id: entity.id,
      userId: entity.userId,
      inApp: entity.inApp,
      email: entity.email,
      push: entity.push,
      eventReminder: entity.eventReminder,
      eventUpdated: entity.eventUpdated,
      eventCancelled: entity.eventCancelled,
      newAttendee: entity.newAttendee,
      attendeeCancelled: entity.attendeeCancelled,
      systemNotification: entity.systemNotification,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findById(id: string): Promise<NotificationPreference | null> {
    const entity = this.preferences.find(p => p.id === id);
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<NotificationPreference | null> {
    const entity = this.preferences.find(p => p.userId === userId);
    return entity ? this.toDomain(entity) : null;
  }

  async create(preference: NotificationPreference): Promise<NotificationPreference> {
    const entity = this.toEntity(preference);
    this.preferences.push(entity);
    return preference;
  }

  async update(preference: NotificationPreference): Promise<NotificationPreference> {
    const index = this.preferences.findIndex(p => p.id === preference.id);
    
    if (index !== -1) {
      const entity = this.toEntity(preference);
      this.preferences[index] = entity;
    }
    
    return preference;
  }

  async delete(id: string): Promise<void> {
    const index = this.preferences.findIndex(p => p.id === id);
    
    if (index !== -1) {
      this.preferences.splice(index, 1);
    }
  }
} 