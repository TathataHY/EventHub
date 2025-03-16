import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationRepository, Notification } from 'eventhub-domain';
import { NotificationEntity } from '../../entities/typeorm/NotificationEntity';

@Injectable()
export class TypeOrmNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const notificationEntity = await this.notificationRepository.findOne({
      where: { id }
    });

    if (!notificationEntity) {
      return null;
    }

    return this.mapToDomain(notificationEntity);
  }

  async findByUserId(
    userId: string,
    filters?: { page?: number; limit?: number; read?: boolean }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
    queryBuilder.where('notification.userId = :userId', { userId });
    
    // Filtrar por estado de lectura si se especifica
    if (filters?.read !== undefined) {
      queryBuilder.andWhere('notification.read = :read', { read: filters.read });
    }
    
    // Aplicar paginación
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;
    
    queryBuilder.skip(skip).take(limit);
    
    // Ordenar por fecha de creación descendente (más recientes primero)
    queryBuilder.orderBy('notification.createdAt', 'DESC');
    
    const [notifications, total] = await queryBuilder.getManyAndCount();
    
    return {
      notifications: notifications.map(notification => this.mapToDomain(notification)),
      total
    };
  }

  async countUnread(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: {
        userId,
        read: false
      }
    });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id }
    });

    if (!notification) {
      return null;
    }

    notification.read = true;
    const updatedNotification = await this.notificationRepository.save(notification);
    
    return this.mapToDomain(updatedNotification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update()
      .set({ read: true })
      .where('userId = :userId AND read = :read', { userId, read: false })
      .execute();
  }

  async save(notification: Notification): Promise<Notification> {
    const notificationEntity = this.mapToEntity(notification);
    const savedNotification = await this.notificationRepository.save(notificationEntity);
    return this.mapToDomain(savedNotification);
  }

  async delete(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  private mapToDomain(entity: NotificationEntity): Notification {
    return new Notification(
      entity.id,
      entity.userId,
      entity.title,
      entity.message,
      entity.type,
      entity.read,
      entity.relatedEntityId,
      entity.relatedEntityType,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private mapToEntity(notification: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = notification.id;
    entity.userId = notification.userId;
    entity.title = notification.title;
    entity.message = notification.message;
    entity.type = notification.type;
    entity.read = notification.read;
    entity.relatedEntityId = notification.relatedEntityId;
    entity.relatedEntityType = notification.relatedEntityType;
    entity.createdAt = notification.createdAt;
    entity.updatedAt = notification.updatedAt;
    return entity;
  }
} 