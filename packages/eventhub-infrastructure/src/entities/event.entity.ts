import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToMany
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TicketEntity } from './ticket.entity';
import { CommentEntity } from './comment.entity';
import { RatingEntity } from './rating.entity';
import { CategoryEntity } from './category.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'max_participants', nullable: true })
  maxParticipants: number;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'is_cancelled', default: false })
  isCancelled: boolean;

  @Column({ name: 'organizer_id' })
  organizerId: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UserEntity, user => user.organizedEvents)
  @JoinColumn({ name: 'organizer_id' })
  organizer: UserEntity;

  @OneToMany(() => TicketEntity, ticket => ticket.event)
  tickets: TicketEntity[];
  
  @OneToMany(() => CommentEntity, comment => comment.event)
  comments: CommentEntity[];
  
  @OneToMany(() => RatingEntity, rating => rating.event)
  ratings: RatingEntity[];
  
  @ManyToMany(() => CategoryEntity, category => category.events)
  categories: CategoryEntity[];
} 