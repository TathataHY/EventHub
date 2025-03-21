import { injectable, inject } from 'inversify';
import { Repository } from 'typeorm';
import { 
  Payment, 
  IPaymentRepository, 
  FindPaymentsOptions, 
  PaymentStatus 
} from '@eventhub/domain';
import { PaymentEntity } from '../entities/PaymentEntity';
import { PaymentMapper } from '../mappers/PaymentMapper';

@injectable()
export class PaymentRepositoryTypeORM implements IPaymentRepository {
  constructor(
    @inject('PaymentEntityRepository') private repository: Repository<PaymentEntity>
  ) {}

  /**
   * Guarda un pago
   * @param payment Pago a guardar
   * @returns Pago guardado
   */
  async save(payment: Payment): Promise<Payment> {
    const entity = PaymentMapper.toEntity(payment);
    const savedEntity = await this.repository.save(entity);
    return PaymentMapper.toDomain(savedEntity);
  }

  /**
   * Encuentra un pago por su ID
   * @param id ID del pago
   * @returns Pago o null si no existe
   */
  async findById(id: string): Promise<Payment | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  /**
   * Encuentra pagos con opciones de filtrado
   * @param options Opciones de filtrado
   * @returns Pagos y total
   */
  async findPayments(options: FindPaymentsOptions): Promise<{ payments: Payment[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('payment');
    
    // Aplicar filtros
    if (options.userId) {
      queryBuilder.andWhere('payment.userId = :userId', { userId: options.userId });
    }
    
    if (options.eventId) {
      queryBuilder.andWhere('payment.eventId = :eventId', { eventId: options.eventId });
    }
    
    if (options.status) {
      queryBuilder.andWhere('payment.status = :status', { status: options.status });
    }
    
    if (options.fromDate) {
      queryBuilder.andWhere('payment.createdAt >= :fromDate', { fromDate: options.fromDate });
    }
    
    if (options.toDate) {
      queryBuilder.andWhere('payment.createdAt <= :toDate', { toDate: options.toDate });
    }
    
    // Configurar paginación
    const page = options.page || 1;
    const perPage = options.perPage || 10;
    const skip = (page - 1) * perPage;
    
    queryBuilder.orderBy('payment.createdAt', 'DESC');
    queryBuilder.skip(skip);
    queryBuilder.take(perPage);
    
    // Ejecutar consulta
    const [entities, total] = await queryBuilder.getManyAndCount();
    
    // Mapear resultados
    const payments = entities.map(entity => PaymentMapper.toDomain(entity));
    
    return { payments, total };
  }

  /**
   * Encuentra pagos por usuario
   * @param userId ID del usuario
   * @returns Lista de pagos
   */
  async findByUserId(userId: string): Promise<Payment[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    
    return entities.map(entity => PaymentMapper.toDomain(entity));
  }

  /**
   * Encuentra pagos por evento
   * @param eventId ID del evento
   * @returns Lista de pagos
   */
  async findByEventId(eventId: string): Promise<Payment[]> {
    const entities = await this.repository.find({
      where: { eventId },
      order: { createdAt: 'DESC' }
    });
    
    return entities.map(entity => PaymentMapper.toDomain(entity));
  }

  /**
   * Encuentra pagos por usuario y evento
   * @param userId ID del usuario
   * @param eventId ID del evento
   * @returns Lista de pagos
   */
  async findByUserIdAndEventId(userId: string, eventId: string): Promise<Payment[]> {
    const entities = await this.repository.find({
      where: { userId, eventId },
      order: { createdAt: 'DESC' }
    });
    
    return entities.map(entity => PaymentMapper.toDomain(entity));
  }

  /**
   * Encuentra un pago por su ID en el proveedor
   * @param providerPaymentId ID del pago en el proveedor
   * @returns Pago o null si no existe
   */
  async findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null> {
    const entity = await this.repository.findOne({
      where: { providerPaymentId }
    });
    
    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  /**
   * Cuenta los pagos para un evento por estado
   * @param eventId ID del evento
   * @param status Estado del pago
   * @returns Número de pagos
   */
  async countByEventIdAndStatus(eventId: string, status: PaymentStatus): Promise<number> {
    return await this.repository.count({
      where: { eventId, status }
    });
  }

  /**
   * Calcula el total recaudado para un evento
   * @param eventId ID del evento
   * @returns Monto total recaudado
   */
  async calculateTotalAmountByEventId(eventId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.eventId = :eventId', { eventId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();
    
    return result.total || 0;
  }
} 