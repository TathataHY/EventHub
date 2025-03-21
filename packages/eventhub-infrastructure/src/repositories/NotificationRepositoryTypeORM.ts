import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { INotificationRepository } from '../../../eventhub-domain/src/repositories/INotificationRepository';
import { Notification } from '../../../eventhub-domain/src/entities/Notification';
import { NotificationEntity } from '../entities/NotificationEntity';
import { NotificationMapper } from '../mappers/NotificationMapper';

/**
 * Implementación del repositorio de notificaciones con TypeORM
 */
@injectable()
export class NotificationRepositoryTypeORM implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private repository: Repository<NotificationEntity>
  ) {}

  /**
   * Guarda una notificación
   * @param notification Notificación a guardar
   * @returns Notificación guardada
   */
  async save(notification: Notification): Promise<Notification> {
    // Mapear del dominio a la entidad de TypeORM
    const entity = NotificationMapper.toEntity(notification);
    
    // Guardar la entidad
    const savedEntity = await this.repository.save(entity);
    
    // Mapear la entidad guardada de vuelta al dominio
    return NotificationMapper.toDomain(savedEntity);
  }

  /**
   * Obtiene una notificación por su ID
   * @param id ID de la notificación
   * @returns Notificación encontrada o null si no existe
   */
  async findById(id: string): Promise<Notification | null> {
    const entity = await this.repository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }
    
    return NotificationMapper.toDomain(entity);
  }

  /**
   * Obtiene todas las notificaciones de un usuario
   * @param userId ID del usuario
   * @returns Lista de notificaciones
   */
  async findByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    
    return entities.map(entity => NotificationMapper.toDomain(entity));
  }

  /**
   * Obtiene notificaciones de un usuario paginadas
   * @param userId ID del usuario
   * @param page Número de página (comienza en 1)
   * @param perPage Elementos por página
   * @returns Notificaciones paginadas y total
   */
  async findByUserIdPaginated(
    userId: string, 
    page: number, 
    perPage: number
  ): Promise<{ notifications: Notification[], total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage
    });
    
    const notifications = entities.map(entity => NotificationMapper.toDomain(entity));
    
    return { notifications, total };
  }

  /**
   * Obtiene notificaciones no leídas de un usuario
   * @param userId ID del usuario
   * @returns Lista de notificaciones no leídas
   */
  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.repository.find({ 
      where: { userId, read: false },
      order: { createdAt: 'DESC' }
    });
    
    return entities.map(entity => NotificationMapper.toDomain(entity));
  }

  /**
   * Obtiene notificaciones no leídas de un usuario paginadas
   * @param userId ID del usuario
   * @param page Número de página (comienza en 1)
   * @param perPage Elementos por página
   * @returns Notificaciones paginadas y total
   */
  async findUnreadByUserIdPaginated(
    userId: string, 
    page: number, 
    perPage: number
  ): Promise<{ notifications: Notification[], total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage
    });
    
    const notifications = entities.map(entity => NotificationMapper.toDomain(entity));
    
    return { notifications, total };
  }

  /**
   * Obtiene el número de notificaciones no leídas de un usuario
   * @param userId ID del usuario
   * @returns Número de notificaciones no leídas
   */
  async countUnreadByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { userId, read: false } });
  }

  /**
   * Elimina una notificación
   * @param id ID de la notificación
   * @returns true si se eliminó correctamente
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  /**
   * Elimina todas las notificaciones de un usuario
   * @param userId ID del usuario
   * @returns Número de notificaciones eliminadas
   */
  async deleteAllByUserId(userId: string): Promise<number> {
    const result = await this.repository.delete({ userId });
    return result.affected || 0;
  }
} 