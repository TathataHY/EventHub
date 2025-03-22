import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { NotificationType } from '../../../eventhub-domain/src/value-objects/NotificationType';
import { NotificationChannel } from '../../../eventhub-domain/src/value-objects/NotificationChannel';

/**
 * Entidad de plantilla de notificación para TypeORM
 */
@Entity('notification_templates')
export class NotificationTemplateEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  @Index()
  notificationType: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationChannel
  })
  @Index()
  channel: NotificationChannel;

  @Column('text')
  titleTemplate: string;

  @Column('text')
  bodyTemplate: string;

  @Column('text', { nullable: true })
  htmlTemplate?: string;

  @Column('boolean', { default: false })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 