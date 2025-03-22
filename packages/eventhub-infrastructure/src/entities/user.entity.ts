import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm';
import { EventEntity } from './event.entity';
import { TicketEntity } from './ticket.entity';
import { PaymentEntity } from './payment.entity';
import { CommentEntity } from './comment.entity';
import { RatingEntity } from './rating.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ 
    type: 'enum', 
    enum: ['user', 'admin', 'organizer'],
    default: 'user'
  })
  role: string;

  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => EventEntity, event => event.organizer)
  organizedEvents: EventEntity[];

  @OneToMany(() => TicketEntity, ticket => ticket.user)
  tickets: TicketEntity[];

  @OneToMany(() => PaymentEntity, payment => payment.user)
  payments: PaymentEntity[];
  
  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[];
  
  @OneToMany(() => RatingEntity, rating => rating.user)
  ratings: RatingEntity[];
} 