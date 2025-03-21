import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentRepository } from '@eventhub/application/repositories/PaymentRepository';
import { Payment, PaymentStatus } from '@eventhub/application/domain/entities/Payment';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) {}

  async findById(id: string): Promise<Payment | null> {
    const paymentEntity = await this.paymentRepository.findOne({
      where: { id }
    });

    if (!paymentEntity) {
      return null;
    }

    return this.mapToDomain(paymentEntity);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const paymentEntities = await this.paymentRepository.find({
      where: { userId }
    });

    return paymentEntities.map(this.mapToDomain);
  }

  async findByEventId(eventId: string): Promise<Payment[]> {
    const paymentEntities = await this.paymentRepository.find({
      where: { eventId }
    });

    return paymentEntities.map(this.mapToDomain);
  }

  async save(payment: Payment): Promise<Payment> {
    const entity = this.mapToEntity(payment);
    const savedEntity = await this.paymentRepository.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async update(payment: Payment): Promise<Payment> {
    await this.paymentRepository.update(payment.id, this.mapToEntity(payment));
    return payment;
  }

  async getTotalRevenue(since?: Date): Promise<number> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder.select('SUM(payment.amount)', 'total');
    queryBuilder.where('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    if (since) {
      queryBuilder.andWhere('payment.createdAt >= :since', { since });
    }
    
    const result = await queryBuilder.getRawOne();
    return result?.total ? parseFloat(result.total) : 0;
  }

  async getRevenueByEventId(eventId: string): Promise<number> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder.select('SUM(payment.amount)', 'total');
    queryBuilder.where('payment.eventId = :eventId', { eventId });
    queryBuilder.andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    const result = await queryBuilder.getRawOne();
    return result?.total ? parseFloat(result.total) : 0;
  }

  async getRevenueByOrganizerId(organizerId: string, since?: Date): Promise<number> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder.select('SUM(payment.amount)', 'total');
    queryBuilder.innerJoin('payment.event', 'event');
    queryBuilder.where('event.organizerId = :organizerId', { organizerId });
    queryBuilder.andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    if (since) {
      queryBuilder.andWhere('payment.createdAt >= :since', { since });
    }
    
    const result = await queryBuilder.getRawOne();
    return result?.total ? parseFloat(result.total) : 0;
  }

  async getRevenuePerDay(since?: Date): Promise<{ date: string; amount: number }[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder.select('DATE(payment.createdAt)', 'date');
    queryBuilder.addSelect('SUM(payment.amount)', 'amount');
    queryBuilder.where('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    if (since) {
      queryBuilder.andWhere('payment.createdAt >= :since', { since });
    }
    
    queryBuilder.groupBy('date');
    queryBuilder.orderBy('date', 'ASC');
    
    const results = await queryBuilder.getRawMany();
    
    return results.map(item => ({
      date: item.date,
      amount: parseFloat(item.amount)
    }));
  }

  async getRevenueByPeriod(
    organizerId: string,
    groupBy: 'day' | 'week' | 'month',
    since?: Date
  ): Promise<{ period: string; amount: number }[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    
    // Seleccionar el formato de agrupación según el parámetro
    let dateFormat: string;
    switch (groupBy) {
      case 'day':
        dateFormat = 'DATE(payment.createdAt)';
        break;
      case 'week':
        dateFormat = 'YEARWEEK(payment.createdAt, 1)'; // ISO week
        break;
      case 'month':
        dateFormat = "DATE_FORMAT(payment.createdAt, '%Y-%m')";
        break;
      default:
        dateFormat = 'DATE(payment.createdAt)';
    }
    
    queryBuilder.select(dateFormat, 'period');
    queryBuilder.addSelect('SUM(payment.amount)', 'amount');
    queryBuilder.innerJoin('payment.event', 'event');
    queryBuilder.where('event.organizerId = :organizerId', { organizerId });
    queryBuilder.andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    if (since) {
      queryBuilder.andWhere('payment.createdAt >= :since', { since });
    }
    
    queryBuilder.groupBy('period');
    queryBuilder.orderBy('period', 'ASC');
    
    const results = await queryBuilder.getRawMany();
    
    // Formatear el resultado según el tipo de agrupación
    return results.map(item => {
      let formattedPeriod = item.period;
      
      // Si es por semana, convertir a una fecha representativa (primer día de esa semana)
      if (groupBy === 'week') {
        const year = Math.floor(item.period / 100);
        const week = item.period % 100;
        formattedPeriod = `${year}-W${week}`;
      }
      
      return {
        period: formattedPeriod,
        amount: parseFloat(item.amount)
      };
    });
  }

  async getTopOrganizers(
    limit: number,
    since?: Date
  ): Promise<{ organizerId: string; organizerName: string; eventCount: number; revenue: number }[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder.select('event.organizerId', 'organizerId');
    queryBuilder.addSelect('user.name', 'organizerName');
    queryBuilder.addSelect('COUNT(DISTINCT event.id)', 'eventCount');
    queryBuilder.addSelect('SUM(payment.amount)', 'revenue');
    
    queryBuilder.innerJoin('payment.event', 'event');
    queryBuilder.innerJoin('event.organizer', 'user');
    queryBuilder.where('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    if (since) {
      queryBuilder.andWhere('payment.createdAt >= :since', { since });
    }
    
    queryBuilder.groupBy('event.organizerId');
    queryBuilder.addGroupBy('user.name');
    queryBuilder.orderBy('revenue', 'DESC');
    queryBuilder.limit(limit);
    
    const results = await queryBuilder.getRawMany();
    
    return results.map(item => ({
      organizerId: item.organizerId,
      organizerName: item.organizerName,
      eventCount: parseInt(item.eventCount, 10),
      revenue: parseFloat(item.revenue)
    }));
  }

  async getTopEvents(
    limit: number,
    since?: Date
  ): Promise<{ eventId: string; eventTitle: string; organizerId: string; organizerName: string; ticketsSold: number; revenue: number }[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    queryBuilder.select('payment.eventId', 'eventId');
    queryBuilder.addSelect('event.title', 'eventTitle');
    queryBuilder.addSelect('event.organizerId', 'organizerId');
    queryBuilder.addSelect('user.name', 'organizerName');
    queryBuilder.addSelect('COUNT(payment.id)', 'ticketsSold');
    queryBuilder.addSelect('SUM(payment.amount)', 'revenue');
    
    queryBuilder.innerJoin('payment.event', 'event');
    queryBuilder.innerJoin('event.organizer', 'user');
    queryBuilder.where('payment.status = :status', { status: PaymentStatus.COMPLETED });
    
    if (since) {
      queryBuilder.andWhere('payment.createdAt >= :since', { since });
    }
    
    queryBuilder.groupBy('payment.eventId');
    queryBuilder.addGroupBy('event.title');
    queryBuilder.addGroupBy('event.organizerId');
    queryBuilder.addGroupBy('user.name');
    queryBuilder.orderBy('revenue', 'DESC');
    queryBuilder.limit(limit);
    
    const results = await queryBuilder.getRawMany();
    
    return results.map(item => ({
      eventId: item.eventId,
      eventTitle: item.eventTitle,
      organizerId: item.organizerId,
      organizerName: item.organizerName,
      ticketsSold: parseInt(item.ticketsSold, 10),
      revenue: parseFloat(item.revenue)
    }));
  }

  private mapToDomain(entity: PaymentEntity): Payment {
    return new Payment({
      id: entity.id,
      userId: entity.userId,
      eventId: entity.eventId,
      ticketId: entity.ticketId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      method: entity.method,
      transactionId: entity.transactionId,
      receiptUrl: entity.receiptUrl,
      paymentIntent: entity.paymentIntent,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  private mapToEntity(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.eventId = domain.eventId;
    entity.ticketId = domain.ticketId;
    entity.amount = domain.amount;
    entity.currency = domain.currency;
    entity.status = domain.status;
    entity.method = domain.method;
    entity.transactionId = domain.transactionId;
    entity.receiptUrl = domain.receiptUrl;
    entity.paymentIntent = domain.paymentIntent;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
} 