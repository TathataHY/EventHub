import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference, NotificationPreferenceRepository } from 'eventhub-domain';
import { NotificationPreferenceEntity } from '../../entities/typeorm/NotificationPreferenceEntity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TypeOrmNotificationPreferenceRepository implements NotificationPreferenceRepository {
  constructor(
    @InjectRepository(NotificationPreferenceEntity)
    private readonly repository: Repository<NotificationPreferenceEntity>
  ) {}

  async findById(id: string): Promise<NotificationPreference | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<NotificationPreference | null> {
    const entity = await this.repository.findOne({ where: { userId } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async create(preference: NotificationPreference): Promise<NotificationPreference> {
    // Verificar que no exista una preferencia para este usuario
    const existing = await this.findByUserId(preference.userId);
    if (existing) {
      throw new Error(`Ya existe una preferencia para el usuario ${preference.userId}`);
    }
    
    // Mapear a entidad y guardar
    const entity = this.mapToEntity(preference);
    const savedEntity = await this.repository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async update(preference: NotificationPreference): Promise<NotificationPreference> {
    // Verificar que exista
    const existing = await this.findById(preference.id);
    if (!existing) {
      throw new Error(`Preferencia con ID ${preference.id} no encontrada`);
    }
    
    // Mapear a entidad y guardar
    const entity = this.mapToEntity(preference);
    const updatedEntity = await this.repository.save(entity);
    return this.mapToDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
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
   * Mapea una entidad a un objeto de dominio
   * @param entity Entidad TypeORM
   * @returns Objeto de dominio
   */
  private mapToDomain(entity: NotificationPreferenceEntity): NotificationPreference {
    return new NotificationPreference(
      entity.id,
      entity.userId,
      entity.emailEnabled,
      entity.pushEnabled,
      entity.inAppEnabled,
      entity.eventReminder,
      entity.eventUpdated,
      entity.eventCancelled,
      entity.newAttendee,
      entity.attendeeRemoved,
      entity.systemNotifications,
      entity.createdAt,
      entity.updatedAt
    );
  }

  /**
   * Mapea un objeto de dominio a una entidad TypeORM
   * @param preference Objeto de dominio
   * @returns Entidad TypeORM
   */
  private mapToEntity(preference: NotificationPreference): NotificationPreferenceEntity {
    const entity = new NotificationPreferenceEntity();
    entity.id = preference.id;
    entity.userId = preference.userId;
    entity.emailEnabled = preference.emailEnabled;
    entity.pushEnabled = preference.pushEnabled;
    entity.inAppEnabled = preference.inAppEnabled;
    entity.eventReminder = preference.eventReminder;
    entity.eventUpdated = preference.eventUpdated;
    entity.eventCancelled = preference.eventCancelled;
    entity.newAttendee = preference.newAttendee;
    entity.attendeeRemoved = preference.attendeeRemoved;
    entity.systemNotifications = preference.systemNotifications;
    entity.createdAt = preference.createdAt;
    entity.updatedAt = preference.updatedAt;
    return entity;
  }
} 