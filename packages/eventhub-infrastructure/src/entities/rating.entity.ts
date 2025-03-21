import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Unique
} from 'typeorm';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

@Entity('ratings')
@Unique(['userId', 'eventId'])
export class RatingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', width: 1 })
  score: number;

  @Column({ type: 'text', nullable: true })
  review: string | null;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UserEntity, user => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => EventEntity, event => event.ratings)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;
} 