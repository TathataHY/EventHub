import { Notification, NotificationRepository } from 'eventhub-domain';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/NotificationEntity';

/**
 * Implementación de NotificationRepository utilizando TypeORM
 */
@Injectable()
export class TypeOrmNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>
  ) {}

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(notification: Notification): NotificationEntity {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      relatedId: notification.relatedId,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private toDomain(entity: NotificationEntity): Notification {
    return new Notification({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      isRead: entity.isRead,
      relatedId: entity.relatedId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.notificationRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(
    userId: string, 
    options?: {
      page?: number;
      limit?: number;
      isRead?: boolean;
      type?: string;
    }
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Valores por defecto
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Construir query
    let query = this.notificationRepository.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });
    
    // Filtros
    if (options?.isRead !== undefined) {
      query = query.andWhere('notification.isRead = :isRead', { isRead: options.isRead });
    }
    
    if (options?.type) {
      query = query.andWhere('notification.type = :type', { type: options.type });
    }
    
    // Paginación
    const [entities, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();
      
    // Mapear a entidades de dominio
    const notifications = entities.map(entity => this.toDomain(entity));
    
    return {
      notifications,
      total,
      page,
      limit
    };
  }

  async markAsRead(id: string): Promise<Notification> {
    await this.notificationRepository.update(id, { isRead: true });
    const entity = await this.notificationRepository.findOne({ where: { id } });
    if (!entity) {
      throw new Error('Notification not found');
    }
    return this.toDomain(entity);
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.affected || 0;
  }

  async countUnread(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  async save(notification: Notification): Promise<Notification> {
    const entity = this.toEntity(notification);
    const savedEntity = await this.notificationRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }
} 