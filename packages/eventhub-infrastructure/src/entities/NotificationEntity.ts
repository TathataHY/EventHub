import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { NotificationType } from '../../../eventhub-domain/src/value-objects/NotificationType';
import { NotificationChannel } from '../../../eventhub-domain/src/value-objects/NotificationChannel';

/**
 * Entidad de notificación para TypeORM
 */
@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationChannel
  })
  channel: NotificationChannel;

  @Column('text', { nullable: true })
  html?: string;

  @Column('boolean', { default: false })
  read: boolean;

  @Column('boolean', { default: false })
  sent: boolean;

  @Column('timestamp', { nullable: true })
  deliveredAt?: Date;

  @Column('timestamp', { nullable: true })
  readAt?: Date;

  @Column('uuid', { nullable: true })
  relatedEntityId?: string;

  @Column({ nullable: true })
  relatedEntityType?: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  })
  priority: 'low' | 'medium' | 'high';

  @Column('jsonb', { nullable: true })
  data?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 