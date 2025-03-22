import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string | null;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UserEntity, user => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => EventEntity, event => event.comments)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => CommentEntity, comment => comment.replies)
  @JoinColumn({ name: 'parent_id' })
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, comment => comment.parent)
  replies: CommentEntity[];
} 