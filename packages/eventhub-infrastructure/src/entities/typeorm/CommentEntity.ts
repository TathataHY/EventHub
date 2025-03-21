import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EventEntity } from './EventEntity';
import { UserEntity } from './UserEntity';

/**
 * Entidad de infraestructura para comentarios con TypeORM
 */
@Entity('comments')
export class CommentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  eventId: string;

  @Column('uuid')
  userId: string;

  @Column('text')
  content: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('uuid', { nullable: true })
  parentId: string | null;

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

  @ManyToOne(() => CommentEntity, comment => comment.replies)
  @JoinColumn({ name: 'parentId' })
  parent: CommentEntity | null;

  @OneToMany(() => CommentEntity, comment => comment.parent)
  replies: CommentEntity[];
} 