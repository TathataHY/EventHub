import { NotificationPreference } from '../../../eventhub-domain/src/entities/NotificationPreference';
import { NotificationPreferenceEntity } from '../entities/NotificationPreferenceEntity';

/**
 * Mapper para transformar entre entidades de dominio y entidades de TypeORM para preferencias de notificación
 */
export class NotificationPreferenceMapper {
  /**
   * Convierte una entidad de dominio a una entidad de TypeORM
   * @param preference Entidad de dominio
   * @returns Entidad de TypeORM
   */
  static toEntity(preference: NotificationPreference): NotificationPreferenceEntity {
    const entity = new NotificationPreferenceEntity();
    
    entity.id = preference.id;
    entity.userId = preference.userId;
    entity.channelPreferences = preference.channelPreferences;
    entity.typePreferences = preference.typePreferences;
    entity.createdAt = preference.createdAt;
    entity.updatedAt = preference.updatedAt;
    
    return entity;
  }

  /**
   * Convierte una entidad de TypeORM a una entidad de dominio
   * @param entity Entidad de TypeORM
   * @returns Entidad de dominio
   */
  static toDomain(entity: NotificationPreferenceEntity): NotificationPreference {
    return new NotificationPreference({
      id: entity.id,
      userId: entity.userId,
      channelPreferences: entity.channelPreferences,
      typePreferences: entity.typePreferences,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 