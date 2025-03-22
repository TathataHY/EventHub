import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('events')
export class EventEntity {
  @PrimaryColumn('uuid')
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

  @Column('uuid')
  organizerId: string;

  @ManyToOne(() => UserEntity, user => user.organizedEvents)
  @JoinColumn({ name: 'organizerId' })
  organizer: UserEntity;

  @Column('int')
  capacity: number;

  @Column('simple-array', { default: '' })
  attendees: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { default: '' })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 