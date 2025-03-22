import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { EventEntity } from './event.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => CategoryEntity, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, category => category.parent)
  children: CategoryEntity[];

  @ManyToMany(() => EventEntity, event => event.categories)
  @JoinTable({
    name: 'event_categories',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' }
  })
  events: EventEntity[];
} 