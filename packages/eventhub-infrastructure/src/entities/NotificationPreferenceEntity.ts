import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * Entidad de preferencias de notificación para TypeORM
 */
@Entity('notification_preferences')
export class NotificationPreferenceEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index({ unique: true })
  userId: string;

  @Column('jsonb')
  channelPreferences: Record<string, {
    enabled: boolean;
    settings?: Record<string, any>;
  }>;

  @Column('jsonb')
  typePreferences: Record<string, {
    enabled: boolean;
    channels?: string[];
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 