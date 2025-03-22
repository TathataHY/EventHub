import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EventEntity } from './EventEntity';
import { UserEntity } from './UserEntity';

/**
 * Entidad de infraestructura para calificaciones con TypeORM
 */
@Entity('ratings')
export class RatingEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  eventId: string;

  @Column('uuid')
  userId: string;

  @Column('int')
  score: number;

  @Column('text', { nullable: true })
  review: string | null;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => EventEntity, event => event.id)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
} 