import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('events')
export class EventEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  location: string;

  @Column()
  organizerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'organizerId' })
  organizer: UserEntity;

  @Column({ nullable: true })
  capacity: number;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'event_attendees',
    joinColumn: { name: 'eventId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  attendees: UserEntity[];

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 