import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentMethod, PaymentStatus } from '@eventhub/application/domain/entities/Payment';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';
import { TicketEntity } from './ticket.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  eventId: string;

  @ManyToOne(() => EventEntity)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @Column({ type: 'uuid' })
  ticketId: string;

  @ManyToOne(() => TicketEntity)
  @JoinColumn({ name: 'ticketId' })
  ticket: TicketEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ nullable: true })
  paymentIntent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 