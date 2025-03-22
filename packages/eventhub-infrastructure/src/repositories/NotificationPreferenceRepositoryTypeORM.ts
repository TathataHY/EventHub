import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { INotificationPreferenceRepository } from '../../../eventhub-domain/src/repositories/INotificationPreferenceRepository';
import { NotificationPreference } from '../../../eventhub-domain/src/entities/NotificationPreference';
import { NotificationPreferenceEntity } from '../entities/NotificationPreferenceEntity';
import { NotificationPreferenceMapper } from '../mappers/NotificationPreferenceMapper';

/**
 * Implementación del repositorio de preferencias de notificación con TypeORM
 */
@injectable()
export class NotificationPreferenceRepositoryTypeORM implements INotificationPreferenceRepository {
  constructor(
    @InjectRepository(NotificationPreferenceEntity)
    private repository: Repository<NotificationPreferenceEntity>
  ) {}

  /**
   * Guarda preferencias de notificación
   * @param preference Preferencias a guardar
   * @returns Preferencias guardadas
   */
  async save(preference: NotificationPreference): Promise<NotificationPreference> {
    // Mapear del dominio a la entidad de TypeORM
    const entity = NotificationPreferenceMapper.toEntity(preference);
    
    // Guardar la entidad
    const savedEntity = await this.repository.save(entity);
    
    // Mapear la entidad guardada de vuelta al dominio
    return NotificationPreferenceMapper.toDomain(savedEntity);
  }

  /**
   * Obtiene preferencias por su ID
   * @param id ID de las preferencias
   * @returns Preferencias encontradas o null si no existen
   */
  async findById(id: string): Promise<NotificationPreference | null> {
    const entity = await this.repository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }
    
    return NotificationPreferenceMapper.toDomain(entity);
  }

  /**
   * Obtiene preferencias de un usuario
   * @param userId ID del usuario
   * @returns Preferencias del usuario o null si no existen
   */
  async findByUserId(userId: string): Promise<NotificationPreference | null> {
    const entity = await this.repository.findOne({ where: { userId } });
    
    if (!entity) {
      return null;
    }
    
    return NotificationPreferenceMapper.toDomain(entity);
  }

  /**
   * Elimina preferencias
   * @param id ID de las preferencias
   * @returns true si se eliminaron correctamente
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }
} 