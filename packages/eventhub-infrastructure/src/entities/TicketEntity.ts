import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import { EventEntity } from './EventEntity';
import { PaymentEntity } from './PaymentEntity';
import { TicketStatus } from 'eventhub-domain';

/**
 * Entidad Ticket para TypeORM
 */
@Entity('tickets')
export class TicketEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  eventId: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING
  })
  status: TicketStatus;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column()
  validFrom: Date;

  @Column()
  validUntil: Date;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => EventEntity, event => event.id)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @ManyToOne(() => PaymentEntity, payment => payment.id, { nullable: true })
  @JoinColumn({ name: 'paymentId' })
  payment: PaymentEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 