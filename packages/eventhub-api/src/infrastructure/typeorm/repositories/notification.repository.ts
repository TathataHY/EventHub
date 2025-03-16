import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationRepository } from 'eventhub-domain';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const notificationEntity = await this.notificationRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
    if (!notificationEntity) return null;
    return this.toDomain(notificationEntity);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notificationEntities = await this.notificationRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
    return notificationEntities.map(entity => this.toDomain(entity));
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const notificationEntities = await this.notificationRepository.find({
      where: { userId, read: false },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
    return notificationEntities.map(entity => this.toDomain(entity));
  }

  async save(notification: Notification): Promise<Notification> {
    const notificationEntity = this.toEntity(notification);
    const savedEntity = await this.notificationRepository.save(notificationEntity);
    return this.toDomain(savedEntity);
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.update(id, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true }
    );
  }

  async countUnread(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, read: false }
    });
  }

  async delete(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  private toDomain(entity: NotificationEntity): Notification {
    return new Notification({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      read: entity.read,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toEntity(domain: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.title = domain.title;
    entity.message = domain.message;
    entity.type = domain.type;
    entity.read = domain.read;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
} 