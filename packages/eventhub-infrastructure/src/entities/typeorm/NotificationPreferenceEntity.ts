import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notification_preferences')
export class NotificationPreferenceEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  // Canales de notificación
  @Column({ default: true })
  emailEnabled: boolean;

  @Column({ default: false })
  pushEnabled: boolean;

  @Column({ default: true })
  inAppEnabled: boolean;

  // Tipos de notificación
  @Column({ default: true })
  eventReminder: boolean;

  @Column({ default: true })
  eventUpdated: boolean;

  @Column({ default: true })
  eventCancelled: boolean;

  @Column({ default: true })
  newAttendee: boolean;

  @Column({ default: true })
  attendeeRemoved: boolean;

  @Column({ default: true })
  systemNotifications: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 